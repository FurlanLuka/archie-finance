
import { MigrationInterface, QueryRunner } from "typeorm";

export class PaypalApi1662372744954 implements MigrationInterface {
name = 'PaypalApi1662372744954'

public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "payment_identifier" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "userId" uuid NOT NULL,
                "paymentAmount" integer NOT NULL,
                CONSTRAINT "PK_d9ca071feb85a68682274c878d0" PRIMARY KEY ("id")
            )
        `);
}

public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE "payment_identifier"
        `);
}

}

