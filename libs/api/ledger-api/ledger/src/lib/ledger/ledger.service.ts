import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LedgerAccount } from './ledger_account.entity';
import { BigNumber } from 'bignumber.js';
import { LedgerAction, LedgerLog } from './ledger_log.entity';
import {
  InvalidLedgerDeductionAmountError,
  LedgerAccountNotFoundError,
} from './ledger.errors';
import { AssetPrice, AssetPricesService } from '@archie/api/ledger-api/assets';
import {
  InternalLedgerAccountData,
  Ledger,
  LedgerAccountUpdatedPayload,
} from '@archie/api/ledger-api/data-transfer-objects';
import { QueueService } from '@archie/api/utils/queue';
import { LEDGER_ACCOUNT_UPDATED_TOPIC } from '@archie/api/ledger-api/constants';

@Injectable()
export class LedgerService {
  constructor(
    @InjectRepository(LedgerAccount)
    private ledgerRepository: Repository<LedgerAccount>,
    @InjectRepository(LedgerLog)
    private ledgerLogRepository: Repository<LedgerLog>,
    private assetPricesService: AssetPricesService,
    private queueService: QueueService,
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
        ledgerAccount: {
          assetId,
          assetAmount: amount,
          accountValue: BigNumber(amount)
            .multipliedBy(assetPrice.price)
            .toString(),
        },
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

        const accountValue: string = BigNumber(account.amount)
          .multipliedBy(assetPrice.price)
          .toFormat(2);

        ledgerValue = ledgerValue.plus(accountValue);

        return [
          {
            assetId: account.assetId,
            assetPrice: assetPrice.price.toString(),
            accountValue: accountValue,
            assetAmount: account.amount,
          },
        ];
      },
    );

    return {
      value: ledgerValue.toFormat(2),
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
        },
      });

      throw new InvalidLedgerDeductionAmountError({
        userId,
        assetId,
        amount,
      });
    }

    const updatedAmount: BigNumber = assetAmount.minus(deductionAmount);

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
        ledgerAccount: {
          assetId: ledgerAccount.assetId,
          assetAmount: updatedAmount.toString(),
          accountValue: updatedAmount
            .multipliedBy(ledgerAccount.assetPrice)
            .toString(),
        },
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
        ledgerAccount: {
          assetId,
          assetAmount: updatedAmount.toString(),
          accountValue: updatedAmount
            .multipliedBy(ledgerAccount.assetPrice)
            .toString(),
        },
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
