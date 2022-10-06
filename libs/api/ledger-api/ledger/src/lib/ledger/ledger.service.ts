import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { LedgerAccount } from './ledger_account.entity';
import { BigNumber } from 'bignumber.js';
import { LedgerAction, LedgerLog } from './ledger_log.entity';
import { LedgerAccountNotFoundError } from './ledger.errors';
import {
  AssetInformation,
  AssetPrice,
  AssetPricesService,
  AssetsService,
} from '@archie/api/ledger-api/assets';
import {
  InitiateLedgerRecalculationCommandPayload,
  InternalLedgerAccountData,
  Ledger,
  LedgerAccountAction,
  LedgerAccountUpdatedPayload,
  LedgerActionType,
} from '@archie/api/ledger-api/data-transfer-objects';
import { QueueService } from '@archie/api/utils/queue';
import {
  INITIATE_LEDGER_RECALCULATION_COMMAND,
  LEDGER_ACCOUNT_UPDATED_TOPIC,
} from '@archie/api/ledger-api/constants';
import { BatchDecrementLedgerAccounts } from './ledger.interfaces';
import { LedgerUser } from './ledger_user.entity';

@Injectable()
export class LedgerService {
  constructor(
    @InjectRepository(LedgerAccount)
    private ledgerRepository: Repository<LedgerAccount>,
    @InjectRepository(LedgerLog)
    private ledgerLogRepository: Repository<LedgerLog>,
    @InjectRepository(LedgerUser)
    private ledgerUserRepository: Repository<LedgerUser>,
    private assetPricesService: AssetPricesService,
    private assetsService: AssetsService,
    private queueService: QueueService,
    private dataSource: DataSource,
  ) {}

  private MAXIMUM_RECALCULATION_EVENTS = 5000;

  async createLedgerAccount(
    userId: string,
    asset: AssetInformation,
    amount: string,
  ): Promise<void> {
    const assetPrice: AssetPrice =
      await this.assetPricesService.getLatestAssetPrice(asset.id);

    await this.ledgerRepository.save({
      userId,
      assetId: asset.id,
      amount,
    });
    const ledgerActionType = LedgerActionType.DEPOSIT;

    this.queueService.publish<LedgerAccountUpdatedPayload>(
      LEDGER_ACCOUNT_UPDATED_TOPIC,
      {
        userId,
        ledgerAccounts: [
          {
            assetId: asset.id,
            assetAmount: amount,
            accountValue: BigNumber(amount)
              .multipliedBy(assetPrice.price)
              .decimalPlaces(2, BigNumber.ROUND_DOWN)
              .toString(),
            calculatedAt: new Date().toISOString(),
          },
        ],
        action: {
          type: ledgerActionType,
        },
      },
    );

    await this.ledgerLogRepository.insert({
      userId,
      amount,
      assetId: asset.id,
      action: LedgerAction.LEDGER_ACCOUNT_CREATED,
      actionType: ledgerActionType,
    });

    await this.ledgerUserRepository.save({
      userId,
    });
  }

  async getLedgerAccount(
    userId: string,
    asset: AssetInformation,
  ): Promise<InternalLedgerAccountData | null> {
    const ledger: Ledger = await this.getLedger(userId);

    const ledgerAccount: InternalLedgerAccountData | undefined =
      ledger.accounts.find((account) => account.assetId === asset.id);

    if (ledgerAccount === undefined) {
      return null;
    }

    return ledgerAccount;
  }

  async getLedger(userId: string, assetPrice?: AssetPrice[]): Promise<Ledger> {
    const ledgerAccounts: LedgerAccount[] = await this.ledgerRepository.findBy({
      userId,
    });

    const assetPrices: AssetPrice[] =
      assetPrice ?? (await this.assetPricesService.getLatestAssetPrices());

    let ledgerValue: BigNumber = BigNumber(0);

    const accountData: InternalLedgerAccountData[] = ledgerAccounts.flatMap(
      ({ assetId, amount }) => {
        const assetInformation: AssetInformation | undefined =
          this.assetsService.getAssetInformation(assetId);

        if (assetInformation === undefined) {
          return [];
        }

        const assetPrice: AssetPrice | undefined = assetPrices.find(
          (assetPrice) => assetPrice.assetId === assetId,
        );

        if (assetPrice === undefined) {
          return [];
        }

        const accountValue = BigNumber(amount)
          .multipliedBy(assetPrice.price)
          .decimalPlaces(2, BigNumber.ROUND_DOWN);

        ledgerValue = ledgerValue.plus(accountValue);

        return [
          {
            assetId: assetId,
            assetPrice: assetPrice.price.toString(),
            accountValue: accountValue.toString(),
            assetAmount: amount,
          },
        ];
      },
    );

    return {
      value: ledgerValue.decimalPlaces(2, BigNumber.ROUND_DOWN).toString(),
      accounts: accountData,
    };
  }

  async initiateLedgerRecalculation(): Promise<void> {
    const ledgerUsers: LedgerUser[] = await this.ledgerUserRepository.find();

    const chunkSize = Math.ceil(
      ledgerUsers.length / this.MAXIMUM_RECALCULATION_EVENTS,
    );

    for (let i = 0; i < ledgerUsers.length; i += chunkSize) {
      const userIdChunk = ledgerUsers
        .slice(i, i + chunkSize)
        .map((ledgerUser) => ledgerUser.userId);

      this.queueService.publish<InitiateLedgerRecalculationCommandPayload>(
        INITIATE_LEDGER_RECALCULATION_COMMAND,
        {
          userIds: userIdChunk,
        },
      );
    }
  }

  async initiateLedgerRecalcuationCommandHandler(
    payload: InitiateLedgerRecalculationCommandPayload,
  ): Promise<void> {
    const assetPrices: AssetPrice[] =
      await this.assetPricesService.getLatestAssetPrices();

    await Promise.all(
      payload.userIds.map(async (userId) => {
        const ledger = await this.getLedger(userId, assetPrices);

        this.queueService.publish<LedgerAccountUpdatedPayload>(
          LEDGER_ACCOUNT_UPDATED_TOPIC,
          {
            userId,
            ledgerAccounts: ledger.accounts.map(
              ({ assetPrice: _, ...updatedAccount }) => ({
                ...updatedAccount,
                calculatedAt: new Date().toISOString(),
              }),
            ),
            action: {
              type: LedgerActionType.ASSET_PRICE_UPDATE,
            },
          },
        );
      }),
    );
  }

  async decrementLedgerAccount(
    userId: string,
    asset: AssetInformation,
    amount: string,
    action: LedgerAccountAction,
  ): Promise<void> {
    const decrementingAmount = BigNumber(amount).decimalPlaces(
      asset.decimalPlaces,
      BigNumber.ROUND_DOWN,
    );

    const ledgerAccount: InternalLedgerAccountData | null =
      await this.getLedgerAccount(userId, asset);

    if (ledgerAccount === null) {
      throw new LedgerAccountNotFoundError({
        userId,
        assetId: asset.id,
      });
    }

    const assetAmount: BigNumber = BigNumber(ledgerAccount.assetAmount);

    if (decrementingAmount.gt(assetAmount)) {
      Logger.error({
        code: 'INVALID_LEDGER_DEDUCTION_AMOUNT',
        metadata: {
          userId,
          assetId: asset.id,
          amount,
          decrementingAmount: decrementingAmount.toString(),
        },
      });
    }

    const updatedAmount: BigNumber = decrementingAmount.gt(assetAmount)
      ? BigNumber(0)
      : assetAmount
          .minus(decrementingAmount)
          .decimalPlaces(asset.decimalPlaces, BigNumber.ROUND_DOWN);

    await this.ledgerRepository.update(
      {
        userId,
        assetId: asset.id,
      },
      {
        amount: updatedAmount.toString(),
      },
    );

    this.queueService.publish<LedgerAccountUpdatedPayload>(
      LEDGER_ACCOUNT_UPDATED_TOPIC,
      {
        userId,
        ledgerAccounts: [
          {
            assetId: ledgerAccount.assetId,
            assetAmount: updatedAmount.toString(),
            accountValue: updatedAmount
              .multipliedBy(ledgerAccount.assetPrice)
              .decimalPlaces(2, BigNumber.ROUND_DOWN)
              .toString(),
            calculatedAt: new Date().toISOString(),
          },
        ],
        action,
      },
    );

    await this.ledgerLogRepository.insert({
      userId,
      amount,
      assetId: asset.id,
      action: LedgerAction.LEDGER_ACCOUNT_DECREMENTED,
      actionType: action.type,
    });
  }

  async batchDecrementLedgerAccounts(
    userId: string,
    accounts: BatchDecrementLedgerAccounts,
    action: LedgerAccountAction,
  ): Promise<void> {
    const ledger: Ledger = await this.getLedger(userId);

    const queryRunner = this.dataSource.createQueryRunner();

    try {
      await queryRunner.startTransaction();

      const updatedLedgerAccounts: InternalLedgerAccountData[] =
        await Promise.all(
          accounts.map(
            async ({ asset, amount }): Promise<InternalLedgerAccountData> => {
              const ledgerAccount: InternalLedgerAccountData =
                ledger.accounts.find(
                  (account) => account.assetId === asset.id,
                )!;

              const decrementingAmount = BigNumber(amount).decimalPlaces(
                asset.decimalPlaces,
                BigNumber.ROUND_DOWN,
              );

              const assetAmount = BigNumber(ledgerAccount.assetAmount);

              const updatedAmount: BigNumber = decrementingAmount.gt(
                assetAmount,
              )
                ? BigNumber(0)
                : assetAmount
                    .minus(decrementingAmount)
                    .decimalPlaces(asset.decimalPlaces, BigNumber.ROUND_DOWN);

              await queryRunner.manager.update(
                LedgerAccount,
                {
                  userId,
                  assetId: ledgerAccount.assetId,
                },
                {
                  amount: updatedAmount.toString(),
                },
              );

              return {
                assetId: ledgerAccount.assetId,
                assetAmount: updatedAmount.toString(),
                accountValue: updatedAmount
                  .multipliedBy(ledgerAccount.assetPrice)
                  .decimalPlaces(2, BigNumber.ROUND_DOWN)
                  .toString(),
                assetPrice: ledgerAccount.assetPrice,
              };
            },
          ),
        );

      this.queueService.publish<LedgerAccountUpdatedPayload>(
        LEDGER_ACCOUNT_UPDATED_TOPIC,
        {
          userId,
          ledgerAccounts: updatedLedgerAccounts.map(
            ({ assetPrice: _, ...updatedAccount }) => ({
              ...updatedAccount,
              calculatedAt: new Date().toISOString(),
            }),
          ),
          action: action,
        },
      );

      await queryRunner.commitTransaction();
    } catch {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async incrementLedgerAccount(
    userId: string,
    asset: AssetInformation,
    amount: string,
    action: LedgerAccountAction,
  ): Promise<void> {
    const incrementingAmount = BigNumber(amount).decimalPlaces(
      asset.decimalPlaces,
      BigNumber.ROUND_DOWN,
    );

    const ledgerAccount: InternalLedgerAccountData | null =
      await this.getLedgerAccount(userId, asset);

    if (ledgerAccount === null) {
      return this.createLedgerAccount(
        userId,
        asset,
        incrementingAmount.toString(),
      );
    }

    const updatedAmount = BigNumber(ledgerAccount.assetAmount)
      .plus(incrementingAmount)
      .decimalPlaces(asset.decimalPlaces, BigNumber.ROUND_DOWN);

    await this.ledgerRepository.update(
      {
        userId,
        assetId: asset.id,
      },
      {
        amount: updatedAmount.toString(),
      },
    );

    this.queueService.publish<LedgerAccountUpdatedPayload>(
      LEDGER_ACCOUNT_UPDATED_TOPIC,
      {
        userId,
        ledgerAccounts: [
          {
            assetId: asset.id,
            assetAmount: updatedAmount.toString(),
            accountValue: updatedAmount
              .multipliedBy(ledgerAccount.assetPrice)
              .decimalPlaces(2, BigNumber.ROUND_DOWN)
              .toString(),
            calculatedAt: new Date().toISOString(),
          },
        ],
        action,
      },
    );

    await this.ledgerLogRepository.insert({
      userId,
      amount: incrementingAmount.toString(),
      assetId: asset.id,
      action: LedgerAction.LEDGER_ACCOUNT_INCREMENTED,
      actionType: action.type,
    });
  }
}
