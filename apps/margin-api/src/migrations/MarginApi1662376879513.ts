
import { MigrationInterface, QueryRunner } from "typeorm";

export class MarginApi1662376879513 implements MigrationInterface {
name = 'MarginApi1662376879513'

public async up(queryRunner: QueryRunner): Promise<void> {
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
            CREATE UNIQUE INDEX "IDX_b725f79ebcf813112a13822771" ON "margin_margin_calls" ("userId", "deleted_at")
        `);
        await queryRunner.query(`
            CREATE TABLE "margin_check" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "userId" character varying NOT NULL,
                "collateralBalance" double precision NOT NULL,
                "ltv" double precision NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_d1b7c7781638163b568ca1186d8" PRIMARY KEY ("id")
            );
            COMMENT ON COLUMN "margin_check"."collateralBalance" IS 'Approximate asset price in usd. Property is used to calculate collateral value change in usd. Price is updated every time the collateral value updates by 10%'
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
}

public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE "margin_margin_calls"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_a23443f002316b8567dd355066"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_b725f79ebcf813112a13822771"
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
}

}

