
import { MigrationInterface, QueryRunner } from "typeorm";

export class FireblocksApi1664718742265 implements MigrationInterface {
name = 'FireblocksApi1664718742265'

public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "vault_account" (
                "userId" character varying NOT NULL,
                "vaultAccountId" character varying NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_de4c54af7010e9dcaacf135e08e" PRIMARY KEY ("userId")
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
        await queryRunner.query(`
            CREATE TABLE "deposit" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "userId" character varying NOT NULL,
                "assetId" character varying NOT NULL,
                "transactionId" character varying NOT NULL,
                "amount" numeric(28, 18) NOT NULL,
                "fee" numeric(28, 18) NOT NULL,
                "sourceAddress" character varying NOT NULL,
                "destinationAddress" character varying NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_6654b4be449dadfd9d03a324b61" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "withdraw" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "userId" character varying NOT NULL,
                "assetId" character varying NOT NULL,
                "transactionId" character varying NOT NULL,
                "amount" numeric(28, 18) NOT NULL,
                "fee" numeric(28, 18) NOT NULL,
                "sourceVaultId" character varying NOT NULL,
                "destinationAddress" character varying NOT NULL,
                "status" character varying NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_5c172f81689173f75bf5906ef22" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "liquidation" DROP CONSTRAINT "PK_efb904a0d00d98fa23b78898e05"
        `);
        await queryRunner.query(`
            ALTER TABLE "liquidation" DROP COLUMN "internalTransactionId"
        `);
        await queryRunner.query(`
            ALTER TABLE "liquidation" DROP COLUMN "externalTransactionId"
        `);
        await queryRunner.query(`
            ALTER TABLE "liquidation" DROP COLUMN "networkFee"
        `);
        await queryRunner.query(`
            ALTER TABLE "liquidation"
            ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()
        `);
        await queryRunner.query(`
            ALTER TABLE "liquidation"
            ADD CONSTRAINT "PK_5dbd42b2874762f096557112e0c" PRIMARY KEY ("id")
        `);
        await queryRunner.query(`
            ALTER TABLE "liquidation"
            ADD "transactionId" character varying NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "liquidation"
            ADD "fee" numeric(28, 18) NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "liquidation"
            ADD "sourceVaultId" character varying NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "liquidation"
            ADD "destinationVaultId" character varying NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "liquidation" DROP COLUMN "status"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."liquidation_status_enum"
        `);
        await queryRunner.query(`
            ALTER TABLE "liquidation"
            ADD "status" character varying NOT NULL
        `);
}

public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE "vault_account"
        `);
        await queryRunner.query(`
            DROP TABLE "deposit_address"
        `);
        await queryRunner.query(`
            DROP TABLE "deposit"
        `);
        await queryRunner.query(`
            DROP TABLE "withdraw"
        `);
        await queryRunner.query(`
            ALTER TABLE "liquidation"
            ADD CONSTRAINT "PK_efb904a0d00d98fa23b78898e05" PRIMARY KEY ("internalTransactionId")
        `);
        await queryRunner.query(`
            ALTER TABLE "liquidation"
            ADD "internalTransactionId" character varying NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "liquidation"
            ADD "externalTransactionId" character varying
        `);
        await queryRunner.query(`
            ALTER TABLE "liquidation"
            ADD "networkFee" numeric(28, 18) NOT NULL DEFAULT '0'
        `);
        await queryRunner.query(`
            ALTER TABLE "liquidation" DROP COLUMN "id"
        `);
        await queryRunner.query(`
            ALTER TABLE "liquidation" DROP CONSTRAINT "PK_5dbd42b2874762f096557112e0c"
        `);
        await queryRunner.query(`
            ALTER TABLE "liquidation" DROP COLUMN "transactionId"
        `);
        await queryRunner.query(`
            ALTER TABLE "liquidation" DROP COLUMN "fee"
        `);
        await queryRunner.query(`
            ALTER TABLE "liquidation" DROP COLUMN "sourceVaultId"
        `);
        await queryRunner.query(`
            ALTER TABLE "liquidation" DROP COLUMN "destinationVaultId"
        `);
        await queryRunner.query(`
            ALTER TABLE "liquidation"
            ADD "status" "public"."liquidation_status_enum" NOT NULL DEFAULT 'INITIATED'
        `);
        await queryRunner.query(`
            CREATE TYPE "public"."liquidation_status_enum" AS ENUM('INITIATED', 'SUBMITTED', 'COMPLETED', 'FAILED')
        `);
        await queryRunner.query(`
            ALTER TABLE "liquidation" DROP COLUMN "status"
        `);
}

}

