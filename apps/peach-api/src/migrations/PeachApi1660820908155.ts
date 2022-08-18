
import { MigrationInterface, QueryRunner } from "typeorm";

export class PeachApi1660820908155 implements MigrationInterface {
name = 'PeachApi1660820908155'

public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "borrower"
            ADD "plaidPaymentInstrumentId" character varying
        `);
}

public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "borrower" DROP COLUMN "plaidPaymentInstrumentId"
        `);
}

}

