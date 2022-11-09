import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreditApi1663168364110 implements MigrationInterface {
  name = 'CreditApi1663168364110';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "last_adjustment" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "userId" character varying NOT NULL,
                "availableCreditCalculatedAt" TIMESTAMP NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_11f37363f0c238d7d636b93f7ab" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE UNIQUE INDEX "IDX_cd5cfe2bf67c59118c3dd18043" ON "last_adjustment" ("userId")
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TABLE "last_adjustment"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_cd5cfe2bf67c59118c3dd18043"
        `);
  }
}
