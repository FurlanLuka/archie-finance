
import { MigrationInterface, QueryRunner } from "typeorm";

export class CreditApi1663239212960 implements MigrationInterface {
name = 'CreditApi1663239212960'

public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "collateral_withdrawal"
            ADD "fee" double precision
        `);
}

public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "collateral_withdrawal" DROP COLUMN "fee"
        `);
}

}

