
import { MigrationInterface, QueryRunner } from "typeorm";

export class CreditApi1659698474166 implements MigrationInterface {
name = 'CreditApi1659698474166'

public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "plaid_access" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "userId" character varying NOT NULL,
                "accessToken" character varying NOT NULL,
                "itemId" character varying NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_e8217d4f45385473b2992fce020" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_ce1eca47e21e4cc97acbd55552" ON "plaid_access" ("userId")
        `);
}

public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE "plaid_access"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_ce1eca47e21e4cc97acbd55552"
        `);
}

}

