
import { MigrationInterface, QueryRunner } from "typeorm";

export class MarginApi1662640124100 implements MigrationInterface {
name = 'MarginApi1662640124100'

public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP INDEX "public"."IDX_b725f79ebcf813112a13822771"
        `);
}

public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE UNIQUE INDEX "IDX_b725f79ebcf813112a13822771" ON "margin_margin_calls" ("userId", "deleted_at")
        `);
}

}

