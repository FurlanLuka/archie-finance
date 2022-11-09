import { MigrationInterface, QueryRunner } from 'typeorm';

export class PaypalApi1662469768311 implements MigrationInterface {
  name = 'PaypalApi1662469768311';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "order" (
                "id" uuid NOT NULL,
                "userId" character varying NOT NULL,
                "paymentAmount" double precision NOT NULL,
                "orderId" character varying NOT NULL,
                "orderStatus" character varying NOT NULL,
                CONSTRAINT "PK_1031171c13130102495201e3e20" PRIMARY KEY ("id")
            )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TABLE "order"
        `);
  }
}
