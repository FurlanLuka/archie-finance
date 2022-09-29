import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { LedgerAccount } from './ledger_account.entity';
import { BigNumber } from 'bignumber.js';
import { LedgerAction, LedgerLog } from './ledger_log.entity';
import { LedgerAccountNotFoundError } from './ledger.errors';
import { AssetPrice, AssetPricesService } from '@archie/api/ledger-api/assets';
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
    private queueService: QueueService,
    private dataSource: DataSource,
  ) {}

  async createLedgerAccount(
    userId: string,
    assetId: string,
    amount: string,
  ): Promise<void> {
    const assetPrice: AssetPrice =
      await this.assetPricesService.getLatestAssetPrice(assetId);

    await this.ledgerRepository.save({
      userId,
      assetId,
      amount,
    });

    this.queueService.publish<LedgerAccountUpdatedPayload>(
      LEDGER_ACCOUNT_UPDATED_TOPIC,
      {
        userId,
        ledgerAccounts: [
          {
            assetId,
            assetAmount: amount,
            accountValue: BigNumber(amount)
              .multipliedBy(assetPrice.price)
              .toString(),
          },
        ],
      },
    );

    await this.ledgerLogRepository.insert({
      userId,
      amount,
      assetId,
      action: LedgerAction.LEDGER_ACCOUNT_CREATED,
    });
  }

  async getLedgerAccount(
    userId: string,
    assetId: string,
  ): Promise<InternalLedgerAccountData | null> {
    const ledger: Ledger = await this.getLedger(userId);

    const ledgerAccount: InternalLedgerAccountData | undefined =
      ledger.accounts.find((account) => account.assetId === assetId);

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
      (account) => {
        const assetPrice: AssetPrice | undefined = assetPrices.find(
          (assetPrice) => assetPrice.assetId === account.assetId,
        );

        if (assetPrice === undefined) {
          return [];
        }

        const accountValue = BigNumber(account.amount)
          .multipliedBy(assetPrice.price)
          .decimalPlaces(2, BigNumber.ROUND_DOWN);

        ledgerValue = ledgerValue.plus(accountValue);

        return [
          {
            assetId: account.assetId,
            assetPrice: assetPrice.price.toString(),
            accountValue: accountValue.toString(),
            assetAmount: account.amount,
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
    assetId: string,
    amount: string,
    note?: string,
  ): Promise<void> {
    const deductionAmount: BigNumber = BigNumber(amount);

    const ledgerAccount: InternalLedgerAccountData | null =
      await this.getLedgerAccount(userId, assetId);

    if (ledgerAccount === null) {
      throw new LedgerAccountNotFoundError({
        userId,
        assetId,
      });
    }

    const assetAmount: BigNumber = BigNumber(ledgerAccount.assetAmount);

    if (deductionAmount.gt(assetAmount)) {
      Logger.error({
        code: 'INVALID_LEDGER_DEDUCTION_AMOUNT',
        metadata: {
          userId,
          assetId,
          amount,
          deductionAmount,
        },
      });
    }

    const updatedAmount: BigNumber = deductionAmount.gt(assetAmount)
      ? BigNumber(0)
      : assetAmount.minus(deductionAmount);

    await this.ledgerRepository.update(
      {
        userId,
        assetId,
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
      assetId,
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
            async (updateAccount): Promise<InternalLedgerAccountData> => {
              const ledgerAccount: InternalLedgerAccountData =
                ledger.accounts.find(
                  (account) => account.assetId === updateAccount.assetId,
                )!;

              const deductionAmount = BigNumber(updateAccount.amount);
              const assetAmount = BigNumber(ledgerAccount.assetAmount);

              if (deductionAmount.gt(assetAmount)) {
                Logger.error({
                  code: 'INVALID_LEDGER_DEDUCTION_AMOUNT',
                  metadata: {
                    userId,
                    assetId: ledgerAccount.assetId,
                    amount: assetAmount.toString(),
                    deductionAmount,
                  },
                });
              }

              const updatedAmount = deductionAmount.gt(assetAmount)
                ? '0'
                : assetAmount.minus(deductionAmount).toString();

              await queryRunner.manager.update(
                LedgerAccount,
                {
                  userId,
                  assetId: ledgerAccount.assetId,
                },
                {
                  amount: updatedAmount,
                },
              );

              return {
                assetId: ledgerAccount.assetId,
                assetAmount: updatedAmount,
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
    assetId: string,
    amount: string,
    note?: string,
  ): Promise<void> {
    const ledgerAccount: InternalLedgerAccountData | null =
      await this.getLedgerAccount(userId, assetId);

    if (ledgerAccount === null) {
      return this.createLedgerAccount(userId, assetId, amount);
    }

    const updatedAmount = BigNumber(ledgerAccount.assetAmount).plus(amount);

    await this.ledgerRepository.update(
      {
        userId,
        assetId,
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
            assetId,
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
      assetId,
      action: LedgerAction.LEDGER_ACCOUNT_INCREMENTED,
      note,
    });
  }
}
