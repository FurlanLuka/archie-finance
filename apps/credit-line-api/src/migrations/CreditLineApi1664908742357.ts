
import { MigrationInterface, QueryRunner } from "typeorm";

export class CreditLineApi1664908742357 implements MigrationInterface {
name = 'CreditLineApi1664908742357'

public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "ledger_account" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "userId" character varying NOT NULL,
                "assetId" character varying NOT NULL,
                "value" double precision NOT NULL,
                "calculatedAt" numeric NOT NULL,
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
            CREATE TABLE "credit_limit" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "userId" character varying NOT NULL,
                "calculatedOnLedgerValue" double precision NOT NULL,
                "creditLimit" double precision NOT NULL,
                "calculatedAt" numeric NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_a760878320009e08a6883bcc2ba" PRIMARY KEY ("id")
            );
            COMMENT ON COLUMN "credit_limit"."calculatedOnLedgerValue" IS 'Collateral value in usd. It is updated together with the credit limit.'
        `);
        await queryRunner.query(`
            CREATE UNIQUE INDEX "IDX_40a9f1b2ed2a0b6025cedb5a92" ON "credit_limit" ("userId")
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
            DROP TABLE "credit_limit"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_40a9f1b2ed2a0b6025cedb5a92"
        `);
}

}

