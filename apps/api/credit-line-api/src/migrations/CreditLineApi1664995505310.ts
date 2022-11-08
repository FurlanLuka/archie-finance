import { MigrationInterface, QueryRunner } from 'typeorm';
export class CreditLineApi1664995505310 implements MigrationInterface {
  name = 'CreditLineApi1664995505310';
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "ledger_account" DROP COLUMN "calculatedAt"
        `);
    await queryRunner.query(`
            ALTER TABLE "ledger_account"
            ADD "calculatedAt" TIMESTAMP WITH TIME ZONE NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "credit_limit" DROP COLUMN "calculatedAt"
        `);
    await queryRunner.query(`
            ALTER TABLE "credit_limit"
            ADD "calculatedAt" TIMESTAMP WITH TIME ZONE NOT NULL
        `);
  }
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "ledger_account"
            ADD "calculatedAt" numeric NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "ledger_account" DROP COLUMN "calculatedAt"
        `);
    await queryRunner.query(`
            ALTER TABLE "credit_limit"
            ADD "calculatedAt" numeric NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "credit_limit" DROP COLUMN "calculatedAt"
        `);
  }
}
