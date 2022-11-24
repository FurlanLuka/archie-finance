import { Injectable } from '@nestjs/common';
import { LedgerAccountUpdatedPayload } from '@archie/api/ledger-api/data-transfer-objects/types';
import { InjectRepository } from '@nestjs/typeorm';
import { LedgerAccount } from './ledger_account.entity';
import { In, Repository } from 'typeorm';
import { BigNumber } from 'bignumber.js';
import { GroupingHelper } from '@archie/api/utils/helpers';
import { LedgerAccountsPerUser } from './ledger.interfaces';

@Injectable()
export class LedgerService {
  constructor(
    @InjectRepository(LedgerAccount)
    private ledgerAccountRepository: Repository<LedgerAccount>,
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
