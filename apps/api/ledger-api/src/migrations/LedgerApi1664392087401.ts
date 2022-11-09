import { MigrationInterface, QueryRunner } from 'typeorm';

export class LedgerApi1664392087401 implements MigrationInterface {
  name = 'LedgerApi1664392087401';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "ledger_account" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "userId" character varying NOT NULL,
                "assetId" character varying NOT NULL,
                "amount" numeric(28, 18) NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_34640393ff83dad2b4627d7ae5f" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_ef471bdbd17cc6437ba8a1b55c" ON "ledger_account" ("userId")
        `);
    await queryRunner.query(`
            CREATE UNIQUE INDEX "IDX_fbd4ee0ef705a97e5fdae2e4da" ON "ledger_account" ("userId", "assetId")
        `);
    await queryRunner.query(`
            CREATE TYPE "public"."ledger_log_action_enum" AS ENUM(
                'LEDGER_ACCOUNT_CREATED',
                'COLLATERAL_DEPOSIT',
                'COLLATERAL_WITHDRAWAL'
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "ledger_log" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "userId" character varying NOT NULL,
                "assetId" character varying NOT NULL,
                "amount" numeric(28, 18) NOT NULL,
                "action" "public"."ledger_log_action_enum" NOT NULL,
                "note" character varying NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_7305d6d730570ebc5566feb8740" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "asset_prices" (
                "assetId" character varying NOT NULL,
                "price" double precision NOT NULL,
                "dailyChange" double precision NOT NULL,
                "currency" character varying NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_053005c2243c75fe2b7379be6b1" PRIMARY KEY ("assetId")
            )
        `);
    await queryRunner.query(`
            CREATE TYPE "public"."withdrawal_status_enum" AS ENUM(
                'INITIATED',
                'SUBMITTED',
                'FEE_REDUCED',
                'COMPLETED',
                'FAILED'
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "withdrawal" (
                "internalTransactionId" character varying NOT NULL,
                "externalTransactionId" character varying,
                "userId" character varying NOT NULL,
                "status" "public"."withdrawal_status_enum" NOT NULL DEFAULT 'INITIATED',
                "assetId" character varying NOT NULL,
                "amount" numeric(28, 18) NOT NULL,
                "networkFee" numeric(28, 18) NOT NULL DEFAULT '0',
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_0da81268e98e7c3936774a9288c" PRIMARY KEY ("internalTransactionId")
            )
        `);
    await queryRunner.query(`
            CREATE TYPE "public"."liquidation_status_enum" AS ENUM('INITIATED', 'SUBMITTED', 'COMPLETED', 'FAILED')
        `);
    await queryRunner.query(`
            CREATE TABLE "liquidation" (
                "internalTransactionId" character varying NOT NULL,
                "externalTransactionId" character varying,
                "userId" character varying NOT NULL,
                "status" "public"."liquidation_status_enum" NOT NULL DEFAULT 'INITIATED',
                "assetId" character varying NOT NULL,
                "amount" numeric(28, 18) NOT NULL,
                "networkFee" numeric(28, 18) NOT NULL DEFAULT '0',
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_efb904a0d00d98fa23b78898e05" PRIMARY KEY ("internalTransactionId")
            )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TABLE "ledger_account"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_ef471bdbd17cc6437ba8a1b55c"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_fbd4ee0ef705a97e5fdae2e4da"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."ledger_log_action_enum"
        `);
    await queryRunner.query(`
            DROP TABLE "ledger_log"
        `);
    await queryRunner.query(`
            DROP TABLE "asset_prices"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."withdrawal_status_enum"
        `);
    await queryRunner.query(`
            DROP TABLE "withdrawal"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."liquidation_status_enum"
        `);
    await queryRunner.query(`
            DROP TABLE "liquidation"
        `);
  }
}
