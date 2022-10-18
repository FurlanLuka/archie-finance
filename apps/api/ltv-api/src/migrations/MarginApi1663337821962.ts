import { MigrationInterface, QueryRunner } from 'typeorm';

export class MarginApi1663337821962 implements MigrationInterface {
  name = 'MarginApi1663337821962';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
          ALTER TABLE "ltv_collateral" RENAME COLUMN "amount" TO "amount_temp"
      `);

    await queryRunner.query(`
            ALTER TABLE "ltv_collateral"
            ADD "amount" numeric(28, 18) NOT NULL DEFAULT 0
        `);

    await queryRunner.query(
      `UPDATE "ltv_collateral" SET "amount" = "amount_temp"`,
    );

    await queryRunner.query(`
          ALTER TABLE "ltv_collateral" ALTER COLUMN "amount" DROP DEFAULT
      `);

    await queryRunner.query(`
            ALTER TABLE "ltv_collateral" DROP COLUMN "amount_temp"
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
                  ALTER TABLE "ltv_collateral" RENAME COLUMN "amount" TO "amount_temp"
          `);

    await queryRunner.query(`
                  ALTER TABLE "ltv_collateral"
                          ADD "amount" double precision NOT NULL DEFAULT 0
          `);

    await queryRunner.query(
      `UPDATE "ltv_collateral" SET "amount" = "amount_temp"`,
    );

    await queryRunner.query(`
          ALTER TABLE "ltv_collateral" ALTER COLUMN "amount" DROP DEFAULT
      `);

    await queryRunner.query(`
            ALTER TABLE "ltv_collateral" DROP COLUMN "amount_temp"
        `);
  }
}
