
import { MigrationInterface, QueryRunner } from "typeorm";

export class MarginApi1662990692474 implements MigrationInterface {
name = 'MarginApi1662990692474'

public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "margin_check"
            ADD "ltvCalculatedAt" TIMESTAMP NOT NULL
        `);
}

public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "margin_check" DROP COLUMN "ltvCalculatedAt"
        `);
}

}

