
import { MigrationInterface, QueryRunner } from "typeorm";

export class MarginApi1663141610777 implements MigrationInterface {
name = 'MarginApi1663141610777'

public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "margin_check"
            ADD "ltvCalculatedAt" TIMESTAMP NOT NULL DEFAULT '2022-09-14T07:46:50.213Z'
        `);
}

public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "margin_check" DROP COLUMN "ltvCalculatedAt"
        `);
}

}

