
import { MigrationInterface, QueryRunner } from "typeorm";

export class MarginApi1662563334470 implements MigrationInterface {
name = 'MarginApi1662563334470'

public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP INDEX "public"."IDX_7bc187780dee57f072500b3fb3"
        `);
        await queryRunner.query(`
            CREATE UNIQUE INDEX "IDX_7bc187780dee57f072500b3fb3" ON "credit_limit_collateral" ("userId", "asset")
        `);
}

public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE INDEX "IDX_7bc187780dee57f072500b3fb3" ON "credit_limit_collateral" ("userId", "asset")
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_7bc187780dee57f072500b3fb3"
        `);
}

}

