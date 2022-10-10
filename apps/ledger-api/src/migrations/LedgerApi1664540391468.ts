
import { MigrationInterface, QueryRunner } from "typeorm";

export class LedgerApi1664540391468 implements MigrationInterface {
name = 'LedgerApi1664540391468'

public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "ledger_user" (
                "userId" character varying NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_0b516551bfaef51d393c3ae9b1b" PRIMARY KEY ("userId")
            )
        `);
}

public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE "ledger_user"
        `);
}

}

