import { Injectable } from '@nestjs/common';
import {
  LedgerAccountData,
  LedgerAccountUpdatedPayload,
} from '@archie/api/ledger-api/data-transfer-objects/types';
import { InjectRepository } from '@nestjs/typeorm';
import { LedgerAccount } from './ledger_account.entity';
import { DataSource, In, Repository } from 'typeorm';
import { BigNumber } from 'bignumber.js';
import { DateTime } from 'luxon';
import { LedgerAccountsPerUser } from './ledger.interfaces';
import { GroupingHelper } from '@archie/api/utils/helpers';

@Injectable()
export class LedgerService {
  constructor(
    @InjectRepository(LedgerAccount)
    private ledgerAccountRepository: Repository<LedgerAccount>,
    private dataSource: DataSource,
  ) {}

  public async getLedgerAccounts(userId: string): Promise<LedgerAccount[]> {
    return this.ledgerAccountRepository.findBy({
      userId,
    });
  }

  public async getLedgerAccountsPerUser(
    userIds: string[],
  ): Promise<LedgerAccountsPerUser> {
    const ledgerAccounts: LedgerAccount[] =
      await this.ledgerAccountRepository.findBy({
        userId: In(userIds),
      });

    return GroupingHelper.groupBy(
      ledgerAccounts,
      (ledgerAccount) => ledgerAccount.userId,
    );
  }

  public async updateLedgerAccounts(
    userId: string,
    ledgerAccounts: LedgerAccountData[],
  ): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.startTransaction();

    try {
      await Promise.all(
        ledgerAccounts.map(async (ledgerAccountData) => {
          const ledgerAccount = await queryRunner.manager.findOneBy(
            LedgerAccount,
            {
              assetId: ledgerAccountData.assetId,
              userId,
            },
          );

          if (ledgerAccount === null) {
            await queryRunner.manager.save(LedgerAccount, {
              userId,
              assetId: ledgerAccountData.assetId,
              value: BigNumber(ledgerAccountData.accountValue)
                .decimalPlaces(2, BigNumber.ROUND_DOWN)
                .toNumber(),
              calculatedAt: ledgerAccountData.calculatedAt,
            });

            return;
          }

          if (
            DateTime.fromISO(ledgerAccount.calculatedAt) >
            DateTime.fromISO(ledgerAccountData.calculatedAt)
          ) {
            return;
          }

          await queryRunner.manager.update(
            LedgerAccount,
            {
              userId,
              assetId: ledgerAccountData.assetId,
            },
            {
              value: BigNumber(ledgerAccountData.accountValue)
                .decimalPlaces(2, BigNumber.ROUND_DOWN)
                .toNumber(),
              calculatedAt: ledgerAccountData.calculatedAt,
            },
          );
        }),
      );

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  public async updateLedgers(
    ledgers: LedgerAccountUpdatedPayload[],
  ): Promise<void> {
    const allLedgerAccounts: Partial<LedgerAccount>[] = ledgers.flatMap(
      (ledger) => {
        return ledger.ledgerAccounts.map(
          (account): Partial<LedgerAccount> => ({
            userId: ledger.userId,
            assetId: account.assetId,
            calculatedAt: account.calculatedAt,
            value: BigNumber(account.accountValue)
              .decimalPlaces(2, BigNumber.ROUND_DOWN)
              .toNumber(),
          }),
        );
      },
    );

    await this.ledgerAccountRepository
      .createQueryBuilder()
      .insert()
      .into(LedgerAccount)
      .values(allLedgerAccounts)
      .onConflict(
        `("assetId", "userId") DO UPDATE SET "calculatedAt" = EXCLUDED."calculatedAt", "value" = EXCLUDED."value" WHERE ledger_account."calculatedAt" <= EXCLUDED."calculatedAt"`,
      )
      .execute();
  }

  public getLedgerValue(ledgerAccounts: LedgerAccount[]): number {
    const ledgerValue = ledgerAccounts.reduce(
      (previousValue, ledgerAccount) => {
        return previousValue.plus(ledgerAccount.value);
      },
      BigNumber(0),
    );

    return ledgerValue.decimalPlaces(2, BigNumber.ROUND_DOWN).toNumber();
  }
}
