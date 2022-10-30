import { MigrationInterface, QueryRunner } from 'typeorm';
import { LastCreditLimitUpdate } from '@archie/api/peach-api/borrower';
import { Borrower } from '@archie/api/peach-api/borrower';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export class PeachApi1664357380717 implements MigrationInterface {
  name = 'PeachApi1664357380717';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const existingBorrowers: Borrower[] =
      await queryRunner.manager.find<Borrower>('borrower', {});

    const lastCreditUpdateEntities: QueryDeepPartialEntity<LastCreditLimitUpdate>[] =
      existingBorrowers.map((borrower) => ({
        calculatedAt: new Date().toISOString(),
        borrower,
      }));

    await queryRunner.manager.insert(
      'last_credit_limit_update',
      lastCreditUpdateEntities,
    );
  }

  public async down(_queryRunner: QueryRunner): Promise<void> {
    // nothing to rollback
  }
}
