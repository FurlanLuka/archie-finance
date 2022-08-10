
import { MigrationInterface, QueryRunner } from "typeorm";

export class CreditApi1660125952451 implements MigrationInterface {
name = 'CreditApi1660125952451'

public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "plaid_access"
            ADD "accountId" character varying
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_0d5766e325ecee2665e67c6d40" ON "plaid_access" ("itemId")
        `);
}

public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "plaid_access" DROP COLUMN "accountId"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_0d5766e325ecee2665e67c6d40"
        `);
}

}

