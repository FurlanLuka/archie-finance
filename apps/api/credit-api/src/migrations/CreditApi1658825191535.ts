import { MigrationInterface, QueryRunner } from "typeorm";

export class CreditApi1658825191535 implements MigrationInterface {
name = 'CreditApi1658825191535'

public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "credit" (
                "userId" character varying NOT NULL,
                "totalCredit" double precision NOT NULL,
                "availableCredit" double precision NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_9f5fdca6886a2ecdb6d34b23d70" PRIMARY KEY ("userId")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "apto_verification" (
                "userId" character varying NOT NULL,
                "verificationId" character varying NOT NULL,
                "isVerificationCompleted" boolean NOT NULL DEFAULT false,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_8b32968dc9f6db5e9f85807170a" PRIMARY KEY ("userId")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "apto_user" (
                "userId" character varying NOT NULL,
                "aptoUserId" character varying NOT NULL,
                "accessToken" character varying NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_1cd15975b38ea85ef0f7a06d76f" PRIMARY KEY ("userId")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "apto_card_application" (
                "userId" character varying NOT NULL,
                "applicationId" character varying NOT NULL,
                "applicationStatus" character varying NOT NULL,
                "nextAction" character varying NOT NULL,
                "workflowObjectId" character varying NOT NULL,
                "nextActionId" character varying NOT NULL,
                CONSTRAINT "PK_7cc7062ebf3e75dcf44c369d06d" PRIMARY KEY ("userId")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "apto_card" (
                "userId" character varying NOT NULL,
                "cardId" character varying NOT NULL,
                CONSTRAINT "PK_3bd465aab796b3daa6e968f6d9c" PRIMARY KEY ("userId")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "margin_calls" (
                "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "userId" character varying NOT NULL,
                "deleted_at" TIMESTAMP,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_9ec2c4d45752d55f7ca64f44260" PRIMARY KEY ("uuid")
            )
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_f4659309b4f1654f42fb7fb1b0" ON "margin_calls" ("userId")
        `);
        await queryRunner.query(`
            CREATE TABLE "liquidation_logs" (
                "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "userId" character varying NOT NULL,
                "asset" character varying NOT NULL,
                "amount" double precision NOT NULL,
                "price" double precision NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "marginCallUuid" uuid,
                CONSTRAINT "PK_b4f3532fb7be0c36457926c027e" PRIMARY KEY ("uuid")
            )
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_171612f5a7271cbee1e64177f6" ON "liquidation_logs" ("userId")
        `);
        await queryRunner.query(`
            CREATE TABLE "margin_notifications" (
                "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "userId" character varying NOT NULL,
                "sentAtLtv" double precision,
                "active" boolean NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_d93c1f7a7cd9a9350fbe84584fd" PRIMARY KEY ("uuid")
            )
        `);
        await queryRunner.query(`
            CREATE UNIQUE INDEX "IDX_86978529e21019424ccccbfcfd" ON "margin_notifications" ("userId")
        `);
        await queryRunner.query(`
            CREATE TABLE "collateral" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "userId" character varying NOT NULL,
                "asset" character varying NOT NULL,
                "amount" double precision NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_b116c93b30e3710075aa2af1379" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "margin_collateral_check" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "userId" character varying NOT NULL,
                "checked_at_collateral_balance" double precision NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_454a4fcadd3773047e6ede375cb" PRIMARY KEY ("id")
            );
            COMMENT ON COLUMN "margin_collateral_check"."checked_at_collateral_balance" IS 'Approximate asset price in usd. Property is used to calculate collateral value change in usd. Price is updated every time the collateral value updates by 10%'
        `);
        await queryRunner.query(`
            CREATE UNIQUE INDEX "IDX_8d7f73cc6934836c082589a368" ON "margin_collateral_check" ("userId")
        `);
        await queryRunner.query(`
            CREATE TABLE "collateral_deposit" (
                "transactionId" character varying NOT NULL,
                "userId" character varying NOT NULL,
                "asset" character varying NOT NULL,
                "amount" double precision NOT NULL,
                "status" character varying NOT NULL,
                "destinationAddress" character varying,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_02fb4da32f2da42f2a3eda9bd62" PRIMARY KEY ("transactionId")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "collateral_withdrawal" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "userId" character varying NOT NULL,
                "transactionId" character varying,
                "asset" character varying NOT NULL,
                "currentAmount" double precision NOT NULL,
                "withdrawalAmount" double precision NOT NULL,
                "destinationAddress" character varying,
                "status" character varying NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_e04daed3342712ee8e34d41d255" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_6498985531c2513fd08f23bf9a" ON "collateral_withdrawal" ("userId")
        `);
        await queryRunner.query(`
            ALTER TABLE "liquidation_logs"
            ADD CONSTRAINT "FK_8de0ca3c790bd40a446b9221e4d" FOREIGN KEY ("marginCallUuid") REFERENCES "margin_calls"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
}

public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE "credit"
        `);
        await queryRunner.query(`
            DROP TABLE "apto_verification"
        `);
        await queryRunner.query(`
            DROP TABLE "apto_user"
        `);
        await queryRunner.query(`
            DROP TABLE "apto_card_application"
        `);
        await queryRunner.query(`
            DROP TABLE "apto_card"
        `);
        await queryRunner.query(`
            DROP TABLE "margin_calls"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_f4659309b4f1654f42fb7fb1b0"
        `);
        await queryRunner.query(`
            DROP TABLE "liquidation_logs"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_171612f5a7271cbee1e64177f6"
        `);
        await queryRunner.query(`
            DROP TABLE "margin_notifications"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_86978529e21019424ccccbfcfd"
        `);
        await queryRunner.query(`
            DROP TABLE "collateral"
        `);
        await queryRunner.query(`
            DROP TABLE "margin_collateral_check"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_8d7f73cc6934836c082589a368"
        `);
        await queryRunner.query(`
            DROP TABLE "collateral_deposit"
        `);
        await queryRunner.query(`
            DROP TABLE "collateral_withdrawal"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_6498985531c2513fd08f23bf9a"
        `);
        await queryRunner.query(`
            ALTER TABLE "liquidation_logs" DROP CONSTRAINT "FK_8de0ca3c790bd40a446b9221e4d"
        `);
}

}
