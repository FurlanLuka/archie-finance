import { Injectable, Logger } from '@nestjs/common';
import {
  InitiateLedgerAssetLiquidationCommandPayload,
  InternalLedgerAccountData,
  Ledger,
} from '@archie/api/ledger-api/data-transfer-objects';
import { LedgerService } from '../ledger/ledger.service';
import { AssetList, AssetsService } from '@archie/api/ledger-api/assets';
import { AssetInformation } from '@archie/api/ledger-api/assets';
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
  InitiateCollateralLiquidationCommandPayload,
} from '@archie/api/fireblocks-api/data-transfer-objects';
import BigNumber from 'bignumber.js';

interface LiquidatedAccounts {
  assetId: string;
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

  public async initiateLedgerAssetLiquidation({
    userId,
    amount,
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
          firstAccountAsset.liquidationWeight -
          secondAccountAsset.liquidationWeight
        );
      });

    const accountsLiquidationReducerResult = sortedLedgerAccounts.reduce(
      (previousValue, ledgerAccount): AccountsLiquidationReducer => {
        if (BigNumber(previousValue.amountLeftToLiquidate).eq(0)) {
          return previousValue;
        }

        const newLedgerAccountValue = BigNumber(
          ledgerAccount.accountValue,
        ).minus(previousValue.amountLeftToLiquidate);

        if (newLedgerAccountValue.gte(0)) {
          const amountToTake = BigNumber(ledgerAccount.accountValue)
            .minus(newLedgerAccountValue)
            .dividedBy(ledgerAccount.assetPrice);

          return {
            amountLeftToLiquidate: '0',
            accountsToLiquidate: [
              ...previousValue.accountsToLiquidate,
              {
                assetId: ledgerAccount.assetId,
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
                assetId: ledgerAccount.assetId,
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
    );

    await Promise.allSettled(
      accountsLiquidationReducerResult.accountsToLiquidate.map(
        async ({ assetId, amount }) => {
          const internalTransactionId = v4();

          await this.liquidationRepository.insert({
            userId,
            amount,
            assetId,
            internalTransactionId,
            status: LiquidationStatus.INITIATED,
          });

          this.queueService.publish<InitiateCollateralLiquidationCommandPayload>(
            INITIATE_COLLATERAL_LIQUIDATION_COMMAND,
            {
              userId,
              amount,
              assetId,
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
        internalTransactionId,
      },
      {
        externalTransactionId: transactionId,
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