import { MigrationInterface, QueryRunner } from 'typeorm';

export class MarginApi1662981966521 implements MigrationInterface {
  name = 'MarginApi1662981966521';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "ltv_collateral_transactions" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "externalTransactionId" character varying NOT NULL,
                CONSTRAINT "PK_defd72157b26f7452642419e682" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE UNIQUE INDEX "IDX_833c1b2bfc2eba8a7f02f5329f" ON "ltv_collateral_transactions" ("externalTransactionId")
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TABLE "ltv_collateral_transactions"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_833c1b2bfc2eba8a7f02f5329f"
        `);
  }
}
