import { MigrationInterface, QueryRunner } from 'typeorm';

export class MarginApi1663237150104 implements MigrationInterface {
  name = 'MarginApi1663237150104';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP INDEX "public"."IDX_2feda32067a1a825952217e771"
        `);
    await queryRunner.query(`
            ALTER TABLE "credit_limit_collateral_transactions"
            ADD "status" character varying NOT NULL DEFAULT 'initiated'
        `);
    await queryRunner.query(`
            CREATE UNIQUE INDEX "IDX_24fedabbee3b9b1a8e24c57c7f" ON "credit_limit_collateral_transactions" ("externalTransactionId", "status")
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE UNIQUE INDEX "IDX_2feda32067a1a825952217e771" ON "credit_limit_collateral_transactions" ("externalTransactionId")
        `);
    await queryRunner.query(`
            ALTER TABLE "credit_limit_collateral_transactions" DROP COLUMN "status"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_24fedabbee3b9b1a8e24c57c7f"
        `);
  }
}
