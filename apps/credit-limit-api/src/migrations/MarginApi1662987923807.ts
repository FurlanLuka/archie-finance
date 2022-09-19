
import { MigrationInterface, QueryRunner } from "typeorm";

export class MarginApi1662987923807 implements MigrationInterface {
name = 'MarginApi1662987923807'

public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "credit_limit_collateral_transactions" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "externalTransactionId" character varying NOT NULL,
                CONSTRAINT "PK_b9b02450d4f9e0d1e3de6b2c279" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE UNIQUE INDEX "IDX_2feda32067a1a825952217e771" ON "credit_limit_collateral_transactions" ("externalTransactionId")
        `);
}

public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE "credit_limit_collateral_transactions"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_2feda32067a1a825952217e771"
        `);
}

}

