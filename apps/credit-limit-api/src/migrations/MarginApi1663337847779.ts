import { MigrationInterface, QueryRunner } from 'typeorm';

export class MarginApi1663337847779 implements MigrationInterface {
  name = 'MarginApi1663337847779';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
          ALTER TABLE "credit_limit_collateral" RENAME COLUMN "amount" TO "amount_temp"
      `);

    await queryRunner.query(`
            ALTER TABLE "credit_limit_collateral"
            ADD "amount" numeric(27, 17) NOT NULL DEFAULT 0
        `);

    await queryRunner.query(
      `UPDATE "credit_limit_collateral" SET "amount" = "amount_temp"`,
    );

    await queryRunner.query(`
          ALTER TABLE "credit_limit_collateral" ALTER COLUMN "amount" DROP DEFAULT
      `);

    await queryRunner.query(`
            ALTER TABLE "credit_limit_collateral" DROP COLUMN "amount_temp"
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
                  ALTER TABLE "credit_limit_collateral" RENAME COLUMN "amount" TO "amount_temp"
          `);

    await queryRunner.query(`
                  ALTER TABLE "credit_limit_collateral"
                          ADD "amount" double precision NOT NULL DEFAULT 0
          `);

    await queryRunner.query(
      `UPDATE "credit_limit_collateral" SET "amount" = "amount_temp"`,
    );

    await queryRunner.query(`
          ALTER TABLE "credit_limit_collateral" ALTER COLUMN "amount" DROP DEFAULT
      `);

    await queryRunner.query(`
            ALTER TABLE "credit_limit_collateral" DROP COLUMN "amount_temp"
        `);
  }
}
