
import { MigrationInterface, QueryRunner } from "typeorm";

export class PeachApi1662463384055 implements MigrationInterface {
name = 'PeachApi1662463384055'

public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "borrower"
            ADD "paypalInstrumentId" character varying
        `);
}

public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "borrower" DROP COLUMN "paypalInstrumentId"
        `);
}

}

