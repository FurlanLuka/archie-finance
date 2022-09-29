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
  InternalLedgerAccountData,
  Ledger,
  LedgerAccountUpdatedPayload,
} from '@archie/api/ledger-api/data-transfer-objects';
import { QueueService } from '@archie/api/utils/queue';
import { LEDGER_ACCOUNT_UPDATED_TOPIC } from '@archie/api/ledger-api/constants';
import { BatchDecrementLedgerAccounts } from './ledger.interfaces';

@Injectable()
export class LedgerService {
  constructor(
    @InjectRepository(LedgerAccount)
    private ledgerRepository: Repository<LedgerAccount>,
    @InjectRepository(LedgerLog)
    private ledgerLogRepository: Repository<LedgerLog>,
    private assetPricesService: AssetPricesService,
    private assetsService: AssetsService,
    private queueService: QueueService,
    private dataSource: DataSource,
  ) {}

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
          },
        ],
      },
    );

    await this.ledgerLogRepository.insert({
      userId,
      amount,
      assetId: asset.id,
      action: LedgerAction.LEDGER_ACCOUNT_CREATED,
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

  async getLedger(userId: string): Promise<Ledger> {
    const ledgerAccounts: LedgerAccount[] = await this.ledgerRepository.findBy({
      userId,
    });

    const assetPrices: AssetPrice[] =
      await this.assetPricesService.getLatestAssetPrices();

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

  async decrementLedgerAccount(
    userId: string,
    asset: AssetInformation,
    amount: string,
    note?: string,
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
          },
        ],
      },
    );

    await this.ledgerLogRepository.insert({
      userId,
      amount,
      assetId: asset.id,
      action: LedgerAction.LEDGER_ACCOUNT_DECREMENTED,
      note,
    });
  }

  async batchDecrementLedgerAccounts(
    userId: string,
    accounts: BatchDecrementLedgerAccounts,
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
                accountValue: BigNumber(updatedAmount)
                  .dividedBy(ledgerAccount.assetPrice)
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
            ({ assetPrice: _, ...updatedAccount }) => updatedAccount,
          ),
        },
      );
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
    note?: string,
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
          },
        ],
      },
    );

    await this.ledgerLogRepository.insert({
      userId,
      amount: incrementingAmount.toString(),
      assetId: asset.id,
      action: LedgerAction.LEDGER_ACCOUNT_INCREMENTED,
      note,
    });
  }
}
