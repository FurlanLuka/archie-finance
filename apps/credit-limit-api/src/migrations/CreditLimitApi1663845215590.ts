import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreditLimitApi1663845215590 implements MigrationInterface {
  name = 'CreditLimitApi1663845215590';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "credit_limit_asset" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "asset" character varying NOT NULL,
                "credit" double precision NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "creditLimitId" uuid,
                CONSTRAINT "PK_661d71328c53b4b3a6da1d93053" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            ALTER TABLE "credit_limit_asset"
            ADD CONSTRAINT "FK_0f4ece85ec51af842bd975072d2" FOREIGN KEY ("creditLimitId") REFERENCES "credit_limit"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);

    await queryRunner.query(`
            CREATE UNIQUE INDEX "IDX_32be14960c9ecb2685cd008fc7" ON "credit_limit_asset" ("asset", "creditLimitId")
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP INDEX "public"."IDX_32be14960c9ecb2685cd008fc7"
        `);
    await queryRunner.query(`
            DROP TABLE "credit_limit_asset"
        `);
    await queryRunner.query(`
            ALTER TABLE "credit_limit_asset" DROP CONSTRAINT "FK_0f4ece85ec51af842bd975072d2"
        `);
  }
}
