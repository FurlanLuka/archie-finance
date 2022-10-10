import { MigrationInterface, QueryRunner } from 'typeorm';
export class LtvApi1665043729727 implements MigrationInterface {
  name = 'LtvApi1665043729727';
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "ledger_account" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "userId" character varying NOT NULL,
                "assetId" character varying NOT NULL,
                "value" double precision NOT NULL,
                "calculatedAt" TIMESTAMP WITH TIME ZONE NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_34640393ff83dad2b4627d7ae5f" PRIMARY KEY ("id")
            );
            COMMENT ON COLUMN "ledger_account"."value" IS 'Ledger account value in USD'
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_ef471bdbd17cc6437ba8a1b55c" ON "ledger_account" ("userId")
        `);
    await queryRunner.query(`
            CREATE UNIQUE INDEX "IDX_fbd4ee0ef705a97e5fdae2e4da" ON "ledger_account" ("userId", "assetId")
        `);
    await queryRunner.query(`
            CREATE TABLE "margin_call_liquidation" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "isLedgerValueUpdated" boolean NOT NULL DEFAULT false,
                "isCreditUtilizationUpdated" boolean NOT NULL DEFAULT false,
                "amount" double precision NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "marginCallUuid" uuid NOT NULL,
                CONSTRAINT "REL_b0c0115e9a8fcf1399079e91de" UNIQUE ("marginCallUuid"),
                CONSTRAINT "PK_5497e42d984981f5bcf6829c1ef" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_4a979cebd75ef525fdd36b589f" ON "margin_call_liquidation" (
                "isLedgerValueUpdated",
                "isCreditUtilizationUpdated",
                "marginCallUuid"
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "margin_margin_calls" (
                "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "userId" character varying NOT NULL,
                "deleted_at" TIMESTAMP,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_a357602f123f1f76c87ec48ab0b" PRIMARY KEY ("uuid")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_a23443f002316b8567dd355066" ON "margin_margin_calls" ("userId")
        `);
    await queryRunner.query(`
            CREATE TABLE "margin_check" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "userId" character varying NOT NULL,
                "ledgerValue" double precision NOT NULL,
                "ltv" double precision NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_d1b7c7781638163b568ca1186d8" PRIMARY KEY ("id")
            );
            COMMENT ON COLUMN "margin_check"."ledgerValue" IS 'Approximate asset price in usd. Property is used to calculate collateral value change in usd. Price is updated every time the collateral value updates by 10%'
        `);
    await queryRunner.query(`
            CREATE UNIQUE INDEX "IDX_a7d641da922ade7e419bb105cb" ON "margin_check" ("userId")
        `);
    await queryRunner.query(`
            CREATE TABLE "margin_margin_notifications" (
                "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "userId" character varying NOT NULL,
                "sentAtLtv" double precision,
                "active" boolean NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_5415590a19db2fb5767becf2bb7" PRIMARY KEY ("uuid")
            )
        `);
    await queryRunner.query(`
            CREATE UNIQUE INDEX "IDX_93870bb054d546f1ee7fc7ea5e" ON "margin_margin_notifications" ("userId")
        `);
    await queryRunner.query(`
            ALTER TABLE "margin_call_liquidation"
            ADD CONSTRAINT "FK_b0c0115e9a8fcf1399079e91de2" FOREIGN KEY ("marginCallUuid") REFERENCES "margin_margin_calls"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION
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
            DROP TABLE "margin_call_liquidation"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_4a979cebd75ef525fdd36b589f"
        `);
    await queryRunner.query(`
            DROP TABLE "margin_margin_calls"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_a23443f002316b8567dd355066"
        `);
    await queryRunner.query(`
            DROP TABLE "margin_check"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_a7d641da922ade7e419bb105cb"
        `);
    await queryRunner.query(`
            DROP TABLE "margin_margin_notifications"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_93870bb054d546f1ee7fc7ea5e"
        `);
    await queryRunner.query(`
            ALTER TABLE "margin_call_liquidation" DROP CONSTRAINT "FK_b0c0115e9a8fcf1399079e91de2"
        `);
  }
}
