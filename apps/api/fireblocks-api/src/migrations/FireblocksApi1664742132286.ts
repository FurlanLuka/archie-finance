import { MigrationInterface, QueryRunner } from 'typeorm';

export class FireblocksApi1664742132286 implements MigrationInterface {
  name = 'FireblocksApi1664742132286';

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
            CREATE TABLE "liquidation" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "userId" character varying NOT NULL,
                "assetId" character varying NOT NULL,
                "transactionId" character varying NOT NULL,
                "amount" numeric(28, 18) NOT NULL,
                "fee" numeric(28, 18) NOT NULL,
                "sourceVaultId" character varying NOT NULL,
                "destinationVaultId" character varying NOT NULL,
                "status" character varying NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_5dbd42b2874762f096557112e0c" PRIMARY KEY ("id")
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
            DROP TABLE "liquidation"
        `);
    await queryRunner.query(`
            DROP TABLE "withdraw"
        `);
  }
}
