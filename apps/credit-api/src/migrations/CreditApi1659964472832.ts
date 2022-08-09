
import { MigrationInterface, QueryRunner } from "typeorm";

export class CreditApi1659964472832 implements MigrationInterface {
name = 'CreditApi1659964472832'

public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "borrower" (
                "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "userId" character varying NOT NULL,
                "personId" character varying NOT NULL,
                "encryptedEmail" character varying,
                "homeAddressContactId" character varying,
                "creditLineId" character varying,
                "liquidationInstrumentId" character varying,
                "drawId" character varying,
                CONSTRAINT "PK_67619ea97397585e18ce4470581" PRIMARY KEY ("uuid")
            )
        `);
        await queryRunner.query(`
            CREATE UNIQUE INDEX "IDX_6d9e4af9be5a094ad1351896b1" ON "borrower" ("userId")
        `);
}

public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE "borrower"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_6d9e4af9be5a094ad1351896b1"
        `);
}

}

