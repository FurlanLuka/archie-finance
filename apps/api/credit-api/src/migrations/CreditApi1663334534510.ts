import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreditApi1663334534510 implements MigrationInterface {
  name = 'CreditApi1663334534510';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
          ALTER TABLE "collateral" RENAME COLUMN "amount" TO "amount_temp"
      `);

    await queryRunner.query(`
            ALTER TABLE "collateral"
            ADD "amount" numeric(28, 18) NOT NULL DEFAULT 0
        `);

    await queryRunner.query(`UPDATE "collateral" SET "amount" = "amount_temp"`);

    await queryRunner.query(`
          ALTER TABLE "collateral" ALTER COLUMN "amount" DROP DEFAULT
      `);

    await queryRunner.query(`
            ALTER TABLE "collateral" DROP COLUMN "amount_temp"
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
          ALTER TABLE "collateral" RENAME COLUMN "amount" TO "amount_temp"
      `);

    await queryRunner.query(`
          ALTER TABLE "collateral"
              ADD "amount" double precision NOT NULL DEFAULT 0
      `);

    await queryRunner.query(`UPDATE "collateral" SET "amount" = "amount_temp"`);

    await queryRunner.query(`
          ALTER TABLE "collateral" ALTER COLUMN "amount" DROP DEFAULT
      `);

    await queryRunner.query(`
            ALTER TABLE "collateral" DROP COLUMN "amount_temp"
        `);
  }
}
