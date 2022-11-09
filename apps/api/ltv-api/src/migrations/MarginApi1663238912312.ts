import { MigrationInterface, QueryRunner } from 'typeorm';

export class MarginApi1663238912312 implements MigrationInterface {
  name = 'MarginApi1663238912312';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP INDEX "public"."IDX_833c1b2bfc2eba8a7f02f5329f"
        `);
    await queryRunner.query(`
            ALTER TABLE "ltv_collateral_transactions"
            ADD "status" character varying NOT NULL DEFAULT 'initiated'
        `);
    await queryRunner.query(`
            CREATE UNIQUE INDEX "IDX_0e3ce66673b5c8b1feb4d93d85" ON "ltv_collateral_transactions" ("externalTransactionId")
        `);
    await queryRunner.query(`
            CREATE UNIQUE INDEX "IDX_2b0cd8840d658086318aae8723" ON "ltv_collateral_transactions" ("externalTransactionId", "status")
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE UNIQUE INDEX "IDX_833c1b2bfc2eba8a7f02f5329f" ON "ltv_collateral_transactions" ("externalTransactionId")
        `);
    await queryRunner.query(`
            ALTER TABLE "ltv_collateral_transactions" DROP COLUMN "status"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_0e3ce66673b5c8b1feb4d93d85"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_2b0cd8840d658086318aae8723"
        `);
  }
}
