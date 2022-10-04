import { Injectable } from '@nestjs/common';
import { LedgerAccountData } from '@archie/api/ledger-api/data-transfer-objects';
import { InjectRepository } from '@nestjs/typeorm';
import { LedgerAccount } from '../ledger/ledger_account.entity';
import { DataSource, Repository } from 'typeorm';
import { BigNumber } from 'bignumber.js';

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

  public async updateLedgerAccounts(
    userId: string,
    ledgerAccounts: LedgerAccountData[],
  ): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.startTransaction();

    try {
      await Promise.all(
        ledgerAccounts.map(async (ledgerAccountData) => {
          await queryRunner.manager.save(LedgerAccount, {
            userId,
            assetId: ledgerAccountData.assetId,
            value: BigNumber(ledgerAccountData.accountValue)
              .decimalPlaces(2, BigNumber.ROUND_DOWN)
              .toNumber(),
          });
        }),
      );

      await queryRunner.commitTransaction();
    } catch {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  public async getLedgerValue(
    ledgerAccounts: LedgerAccount[],
  ): Promise<number> {
    const ledgerValue = ledgerAccounts.reduce(
      (previousValue, ledgerAccount) => {
        return previousValue.plus(ledgerAccount.value);
      },
      BigNumber(0),
    );

    return ledgerValue.decimalPlaces(2, BigNumber.ROUND_DOWN).toNumber();
  }
}
