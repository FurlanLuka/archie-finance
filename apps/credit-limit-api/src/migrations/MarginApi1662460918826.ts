
import { MigrationInterface, QueryRunner } from "typeorm";

export class MarginApi1662460918826 implements MigrationInterface {
name = 'MarginApi1662460918826'

public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "credit_limit_collateral" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "userId" character varying NOT NULL,
                "asset" character varying NOT NULL,
                "amount" double precision NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_71aa4afff4d76483a93a6bb6ee5" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_1c4c50e02f2ab994127c0a638b" ON "credit_limit_collateral" ("userId")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_7bc187780dee57f072500b3fb3" ON "credit_limit_collateral" ("userId", "asset")
        `);
        await queryRunner.query(`
            CREATE TABLE "credit_limit" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "userId" character varying NOT NULL,
                "calculatedOnCollateralBalance" double precision NOT NULL,
                "creditLimit" double precision NOT NULL,
                "previousCreditLimit" double precision NOT NULL,
                "calculatedAt" TIMESTAMP NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_a760878320009e08a6883bcc2ba" PRIMARY KEY ("id")
            );
            COMMENT ON COLUMN "credit_limit"."calculatedOnCollateralBalance" IS 'Collateral value in usd. It is updated together with the credit limit.'
        `);
        await queryRunner.query(`
            CREATE UNIQUE INDEX "IDX_40a9f1b2ed2a0b6025cedb5a92" ON "credit_limit" ("userId")
        `);
}

public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE "credit_limit_collateral"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_1c4c50e02f2ab994127c0a638b"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_7bc187780dee57f072500b3fb3"
        `);
        await queryRunner.query(`
            DROP TABLE "credit_limit"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_40a9f1b2ed2a0b6025cedb5a92"
        `);
}

}

