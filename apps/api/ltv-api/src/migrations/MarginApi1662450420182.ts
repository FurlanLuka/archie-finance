
import { MigrationInterface, QueryRunner } from "typeorm";

export class MarginApi1662450420182 implements MigrationInterface {
name = 'MarginApi1662450420182'

public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "ltv_credit" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "userId" character varying NOT NULL,
                "utilizationAmount" double precision NOT NULL,
                "calculatedAt" TIMESTAMP NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_c6edcefbe2a07dca341fb8bdfda" UNIQUE ("userId"),
                CONSTRAINT "PK_793317ccfc9ccb6af8b9292f060" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_a0337d7c67af8deec6fed8f9e8" ON "ltv_credit" ("userId", "calculatedAt")
        `);
        await queryRunner.query(`
            CREATE TABLE "ltv_collateral" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "userId" character varying NOT NULL,
                "asset" character varying NOT NULL,
                "amount" double precision NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_d62a621e9af0fc346cbd03e059d" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_da0685ed3450c9fa9edbd5ee34" ON "ltv_collateral" ("userId")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_f958bdc9b4b90f12aa5174a15d" ON "ltv_collateral" ("userId", "asset")
        `);
}

public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE "ltv_credit"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_a0337d7c67af8deec6fed8f9e8"
        `);
        await queryRunner.query(`
            DROP TABLE "ltv_collateral"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_da0685ed3450c9fa9edbd5ee34"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_f958bdc9b4b90f12aa5174a15d"
        `);
}

}

