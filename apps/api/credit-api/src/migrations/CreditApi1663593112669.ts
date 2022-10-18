import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreditApi1663593112669 implements MigrationInterface {
  name = 'CreditApi1663593112669';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "collateral_deposit"
                ALTER COLUMN "amount" SET DATA TYPE numeric(28, 18)
        `);

    await queryRunner.query(`
        ALTER TABLE "collateral_withdrawal"
            ALTER COLUMN "currentAmount" SET DATA TYPE numeric(28, 18)
        `);

    await queryRunner.query(`
        ALTER TABLE "collateral_withdrawal"
            ALTER COLUMN "withdrawalAmount" SET DATA TYPE numeric(28, 18)
          `);

    await queryRunner.query(`
        ALTER TABLE "collateral_withdrawal"
            ALTER COLUMN "fee" SET DATA TYPE numeric(28, 18)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE "collateral_deposit"
            ALTER COLUMN "amount" SET DATA TYPE double precision
        `);

    await queryRunner.query(`
        ALTER TABLE "collateral_withdrawal"
            ALTER COLUMN "currentAmount" SET DATA TYPE double precision
        `);

    await queryRunner.query(`
        ALTER TABLE "collateral_withdrawal"
            ALTER COLUMN "withdrawalAmount" SET DATA TYPE double precision
          `);

    await queryRunner.query(`
        ALTER TABLE "collateral_withdrawal"
            ALTER COLUMN "fee" SET DATA TYPE double precision
    `);
  }
}
