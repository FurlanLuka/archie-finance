
import { MigrationInterface, QueryRunner } from "typeorm";
export class PaypalApi1665667243213 implements MigrationInterface {
name = 'PaypalApi1665667243213'
public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "event_log" (
                "id" character varying NOT NULL,
                "timestamp" numeric NOT NULL,
                "message" json NOT NULL,
                CONSTRAINT "PK_d8ccd9b5b44828ea378dd37e691" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "event_idempotency" (
                "id" character varying NOT NULL,
                "timestamp" numeric NOT NULL,
                CONSTRAINT "PK_9866d66b31d979d38f52e9d3a07" PRIMARY KEY ("id")
            )
        `);
}
public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE "event_log"
        `);
        await queryRunner.query(`
            DROP TABLE "event_idempotency"
        `);
}
}
