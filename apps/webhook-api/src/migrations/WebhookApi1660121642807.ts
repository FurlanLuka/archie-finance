
import { MigrationInterface, QueryRunner } from "typeorm";

export class WebhookApi1660121642807 implements MigrationInterface {
name = 'WebhookApi1660121642807'

public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "peach_events" (
                "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "lastFetchedPaymentAppliedEventId" character varying,
                CONSTRAINT "PK_d72da0f00fbb8049ab3cbb85aff" PRIMARY KEY ("uuid")
            )
        `);
}

public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE "peach_events"
        `);
}

}

