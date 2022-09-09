
import { MigrationInterface, QueryRunner } from "typeorm";

export class MarginApi1662644141968 implements MigrationInterface {
name = 'MarginApi1662644141968'

public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "credit_limit" DROP COLUMN "previousCreditLimit"
        `);
}

public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "credit_limit"
            ADD "previousCreditLimit" double precision NOT NULL
        `);
}

}

