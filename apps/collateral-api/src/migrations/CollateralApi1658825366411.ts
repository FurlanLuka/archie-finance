
import { MigrationInterface, QueryRunner } from "typeorm";

export class CollateralApi1658825366411 implements MigrationInterface {
name = 'CollateralApi1658825366411'

public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "user_vault_account" (
                "userId" character varying NOT NULL,
                "vaultAccountId" character varying NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_03982a44b3e9c16e4a2924b9507" PRIMARY KEY ("userId")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "deposit_address" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "userId" character varying NOT NULL,
                "asset" character varying NOT NULL,
                "address" character varying NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_c97c0b6fab45cc02517dccade1a" PRIMARY KEY ("id")
            )
        `);
}

public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE "user_vault_account"
        `);
        await queryRunner.query(`
            DROP TABLE "deposit_address"
        `);
}

}

