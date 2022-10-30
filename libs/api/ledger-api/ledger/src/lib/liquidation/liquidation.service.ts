import { Injectable, Logger } from '@nestjs/common';
import {
  InitiateLedgerAssetLiquidationCommandPayload,
  InternalLedgerAccountData,
  Ledger,
  LedgerActionType,
  Liquidation as ILiquidation,
} from '@archie/api/ledger-api/data-transfer-objects';
import { LedgerService } from '../ledger/ledger.service';
import {
  AssetInformation,
  AssetList,
  AssetsService,
} from '@archie/api/ledger-api/assets';
import { InjectRepository } from '@nestjs/typeorm';
import { Liquidation, LiquidationStatus } from './liquidation.entity';
import { Repository } from 'typeorm';
import { v4 } from 'uuid';
import { QueueService } from '@archie/api/utils/queue';
import { INITIATE_COLLATERAL_LIQUIDATION_COMMAND } from '@archie/api/fireblocks-api/constants';
import {
  CollateralLiquidationTransactionErrorPayload,
  CollateralLiquidationTransactionSubmittedPayload,
  CollateralLiquidationTransactionUpdatedPayload,
  CollateralLiquidationTransactionUpdatedStatus,
} from '@archie/api/fireblocks-api/data-transfer-objects';
import BigNumber from 'bignumber.js';
import { Lock } from '@archie/api/utils/redis';

interface LiquidatedAccounts {
  asset: AssetInformation;
  amount: string;
}

interface AccountsLiquidationReducer {
  amountLeftToLiquidate: string;
  accountsToLiquidate: LiquidatedAccounts[];
}

@Injectable()
export class LiquidationService {
  constructor(
    @InjectRepository(Liquidation)
    private liquidationRepository: Repository<Liquidation>,
    private ledgerService: LedgerService,
    private assetsService: AssetsService,
    private queueService: QueueService,
  ) {}

  public async getliquidations(userId: string): Promise<ILiquidation[]> {
    const liquidations: Liquidation[] = await this.liquidationRepository.findBy(
      {
        userId,
      },
    );

    return liquidations.map(
      ({ assetId, amount, networkFee, updatedAt, createdAt, status }) => ({
        assetId,
        amount: BigNumber(amount).plus(networkFee).toString(),
        updatedAt: updatedAt.toISOString(),
        createdAt: createdAt.toISOString(),
        status,
      }),
    );
  }

  @Lock(
    (payload: InitiateLedgerAssetLiquidationCommandPayload) => payload.userId,
  )
  public async initiateLedgerAssetLiquidation({
    userId,
    amount,
    liquidationId,
  }: InitiateLedgerAssetLiquidationCommandPayload): Promise<void> {
    const ledger: Ledger = await this.ledgerService.getLedger(userId);

    const assetList: AssetList = this.assetsService.getSupportedAssetList();

    const sortedLedgerAccounts: InternalLedgerAccountData[] =
      ledger.accounts.sort((firstAccount, secondAccount) => {
        const firstAccountAsset: AssetInformation | undefined = assetList.find(
          (asset) => asset.id === firstAccount.assetId,
        );

        const secondAccountAsset: AssetInformation | undefined = assetList.find(
          (asset) => asset.id === secondAccount.assetId,
        );

        if (
          firstAccountAsset === undefined ||
          secondAccountAsset === undefined
        ) {
          return 0;
        }

        return (
          secondAccountAsset.liquidationWeight -
          firstAccountAsset.liquidationWeight
        );
      });

    const accountsLiquidationReducerResult = sortedLedgerAccounts.reduce(
      (previousValue, ledgerAccount): AccountsLiquidationReducer => {
        if (BigNumber(previousValue.amountLeftToLiquidate).eq(0)) {
          return previousValue;
        }

        const assetInformation: AssetInformation | undefined =
          this.assetsService.getAssetInformation(ledgerAccount.assetId);

        if (assetInformation === undefined) {
          return previousValue;
        }

        const newLedgerAccountValue = BigNumber(
          ledgerAccount.accountValue,
        ).minus(previousValue.amountLeftToLiquidate);

        if (newLedgerAccountValue.gte(0)) {
          const amountToTake = BigNumber(ledgerAccount.accountValue)
            .minus(newLedgerAccountValue)
            .dividedBy(ledgerAccount.assetPrice)
            .decimalPlaces(
              assetInformation.decimalPlaces,
              BigNumber.ROUND_DOWN,
            );

          return {
            amountLeftToLiquidate: '0',
            accountsToLiquidate: [
              ...previousValue.accountsToLiquidate,
              {
                asset: assetInformation,
                amount: amountToTake.toString(),
              },
            ],
          };
        } else {
          const amountLeftToLiquidate = newLedgerAccountValue.abs();

          return {
            amountLeftToLiquidate: amountLeftToLiquidate.toString(),
            accountsToLiquidate: [
              ...previousValue.accountsToLiquidate,
              {
                asset: assetInformation,
                amount: ledgerAccount.assetAmount,
              },
            ],
          };
        }
      },
      {
        amountLeftToLiquidate: amount,
        accountsToLiquidate: [],
      },
    );

    await this.ledgerService.batchDecrementLedgerAccounts(
      userId,
      accountsLiquidationReducerResult.accountsToLiquidate,
      {
        type: LedgerActionType.LIQUIDATION,
        liquidation: {
          id: liquidationId,
          usdAmount: amount,
        },
      },
    );

    await Promise.all(
      accountsLiquidationReducerResult.accountsToLiquidate.map(
        async ({ asset, amount: assetAmount }) => {
          const internalTransactionId = v4();

          await this.liquidationRepository.insert({
            userId,
            amount: assetAmount,
            assetId: asset.id,
            internalTransactionId,
            status: LiquidationStatus.INITIATED,
          });

          this.queueService.publishEvent(
            INITIATE_COLLATERAL_LIQUIDATION_COMMAND,
            {
              userId,
              amount: assetAmount,
              assetId: asset.id,
              internalTransactionId,
            },
          );
        },
      ),
    );
  }

  public async liquidationTransactionSubmittedHandler({
    internalTransactionId,
    transactionId,
    userId,
  }: CollateralLiquidationTransactionSubmittedPayload): Promise<void> {
    const liquidationRecord: Liquidation | null =
      await this.liquidationRepository.findOneBy({
        internalTransactionId,
      });

    if (liquidationRecord === null) {
      Logger.error({
        code: 'LIQUIDATION_RECORD_NOT_FOUND',
        metadata: {
          handler: 'submitted',
          transactionId,
          internalTransactionId,
          userId,
        },
      });

      return;
    }

    await this.liquidationRepository.update(
      {
        internalTransactionId,
      },
      {
        externalTransactionId: transactionId,
        status: LiquidationStatus.SUBMITTED,
      },
    );
  }

  public async liquidationTransactionUpdatedHandler({
    userId,
    internalTransactionId,
    transactionId,
    status,
  }: CollateralLiquidationTransactionUpdatedPayload): Promise<void> {
    const liquidationRecord: Liquidation | null =
      await this.liquidationRepository.findOne({
        where: [
          { externalTransactionId: transactionId },
          {
            internalTransactionId,
          },
        ],
      });

    if (liquidationRecord === null) {
      Logger.error({
        code: 'LIQUIDATION_RECORD_NOT_FOUND',
        metadata: {
          handler: 'updated',
          transactionId,
          internalTransactionId,
          userId,
        },
      });

      return;
    }

    const newLiquidationRecordStatus: LiquidationStatus =
      status === CollateralLiquidationTransactionUpdatedStatus.COMPLETED
        ? LiquidationStatus.COMPLETED
        : LiquidationStatus.INITIATED;

    await this.liquidationRepository.update(
      {
        externalTransactionId: transactionId,
      },
      {
        status: newLiquidationRecordStatus,
      },
    );
  }

  public async liquidationTransactionErrorHandler({
    internalTransactionId,
    transactionId,
    userId,
  }: CollateralLiquidationTransactionErrorPayload): Promise<void> {
    const liquidationRecord: Liquidation | null =
      await this.liquidationRepository.findOne({
        where: [
          { externalTransactionId: transactionId },
          {
            internalTransactionId,
          },
        ],
      });

    if (liquidationRecord === null) {
      Logger.error({
        code: 'LIQUIDATION_RECORD_NOT_FOUND',
        metadata: {
          handler: 'error',
          transactionId,
          internalTransactionId,
          userId,
        },
      });

      return;
    }

    const assetInformation: AssetInformation | undefined =
      this.assetsService.getAssetInformation(liquidationRecord.assetId);

    if (assetInformation === undefined) {
      return;
    }

    await this.liquidationRepository.update(
      {
        internalTransactionId,
      },
      {
        externalTransactionId: transactionId,
        status: LiquidationStatus.FAILED,
      },
    );
  }
}
