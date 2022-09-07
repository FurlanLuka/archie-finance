
import { MigrationInterface, QueryRunner } from "typeorm";

export class MarginApi1662563344070 implements MigrationInterface {
name = 'MarginApi1662563344070'

public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP INDEX "public"."IDX_f958bdc9b4b90f12aa5174a15d"
        `);
        await queryRunner.query(`
            CREATE UNIQUE INDEX "IDX_f958bdc9b4b90f12aa5174a15d" ON "ltv_collateral" ("userId", "asset")
        `);
}

public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE INDEX "IDX_f958bdc9b4b90f12aa5174a15d" ON "ltv_collateral" ("userId", "asset")
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_f958bdc9b4b90f12aa5174a15d"
        `);
}

}

