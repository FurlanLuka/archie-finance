import { MigrationInterface, QueryRunner } from 'typeorm';

export class MarginApi1663318696195 implements MigrationInterface {
  name = 'MarginApi1663318696195';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP INDEX "public"."IDX_0e3ce66673b5c8b1feb4d93d85"
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE UNIQUE INDEX "IDX_0e3ce66673b5c8b1feb4d93d85" ON "ltv_collateral_transactions" ("externalTransactionId")
        `);
  }
}
