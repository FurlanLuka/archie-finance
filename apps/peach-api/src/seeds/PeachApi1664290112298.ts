import { MigrationInterface, QueryRunner } from 'typeorm';
import { LastCreditLimitUpdate } from '../../../../libs/api/peach-api/borrower/src/lib/last_credit_limit_update.entity';
import { Borrower } from '../../../../libs/api/peach-api/borrower/src/lib/borrower.entity';

export class PeachApi1664357380717 implements MigrationInterface {
  name = 'PeachApi1664357380717';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const existingBorrower: Borrower[] = await queryRunner.manager.find(
      'borrower',
      {},
    );

    const lastCreditUpdateEntities: Partial<LastCreditLimitUpdate>[] =
      existingBorrower.map((borrower) => ({
        calculatedAt: new Date().toISOString(),
        borrower,
      }));

    await queryRunner.manager.save(
      'last_credit_limit_update',
      lastCreditUpdateEntities,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
