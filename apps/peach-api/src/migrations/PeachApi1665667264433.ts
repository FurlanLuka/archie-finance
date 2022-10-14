
import { MigrationInterface, QueryRunner } from "typeorm";
export class PeachApi1665667264433 implements MigrationInterface {
name = 'PeachApi1665667264433'
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
