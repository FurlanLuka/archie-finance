import { MigrationInterface, QueryRunner } from 'typeorm';
export class LedgerApi1665057363239 implements MigrationInterface {
  name = 'LedgerApi1665057363239';
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "ledger_log" DROP COLUMN "note"
        `);
    await queryRunner.query(`
            ALTER TABLE "ledger_log"
            ADD "actionType" character varying NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "ledger_log" DROP COLUMN "action"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."ledger_log_action_enum"
        `);
    await queryRunner.query(`
            ALTER TABLE "ledger_log"
            ADD "action" character varying NOT NULL
        `);
  }
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "ledger_log"
            ADD "note" character varying
        `);
    await queryRunner.query(`
            ALTER TABLE "ledger_log" DROP COLUMN "actionType"
        `);
    await queryRunner.query(`
            ALTER TABLE "ledger_log"
            ADD "action" "public"."ledger_log_action_enum" NOT NULL
        `);
    await queryRunner.query(`
            CREATE TYPE "public"."ledger_log_action_enum" AS ENUM(
                'LEDGER_ACCOUNT_CREATED',
                'COLLATERAL_DEPOSIT',
                'COLLATERAL_WITHDRAWAL'
            )
        `);
    await queryRunner.query(`
            ALTER TABLE "ledger_log" DROP COLUMN "action"
        `);
  }
}
