
import { MigrationInterface, QueryRunner } from "typeorm";

export class LedgerApi1664443399037 implements MigrationInterface {
name = 'LedgerApi1664443399037'

public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "ledger_log"
            ALTER COLUMN "note" DROP NOT NULL
        `);
}

public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "ledger_log"
            ALTER COLUMN "note"
            SET NOT NULL
        `);
}

}

