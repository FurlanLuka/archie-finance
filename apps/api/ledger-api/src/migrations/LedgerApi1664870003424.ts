import { MigrationInterface, QueryRunner } from 'typeorm';

export class LedgerApi1664870003424 implements MigrationInterface {
  name = 'LedgerApi1664870003424';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "liquidation" DROP COLUMN "status"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."liquidation_status_enum"
        `);
    await queryRunner.query(`
            ALTER TABLE "liquidation"
            ADD "status" character varying NOT NULL
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "liquidation"
            ADD "status" "public"."liquidation_status_enum" NOT NULL DEFAULT 'INITIATED'
        `);
    await queryRunner.query(`
            CREATE TYPE "public"."liquidation_status_enum" AS ENUM('INITIATED', 'SUBMITTED', 'COMPLETED', 'FAILED')
        `);
    await queryRunner.query(`
            ALTER TABLE "liquidation" DROP COLUMN "status"
        `);
  }
}
