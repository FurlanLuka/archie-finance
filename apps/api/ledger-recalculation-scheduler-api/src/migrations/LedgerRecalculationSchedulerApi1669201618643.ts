
import { MigrationInterface, QueryRunner } from "typeorm";
export class LedgerRecalculationSchedulerApi1669201618643 implements MigrationInterface {
name = 'LedgerRecalculationSchedulerApi1669201618643'
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
        await queryRunner.query(`
            CREATE TABLE "ledger_recalculation" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "userId" character varying NOT NULL,
                "ltv" double precision NOT NULL,
                "recalculationTriggeredAt" TIMESTAMP WITH TIME ZONE NOT NULL,
                "processedAt" TIMESTAMP WITH TIME ZONE NOT NULL,
                CONSTRAINT "UQ_aa3d2bc2e635cc9d92215220dc4" UNIQUE ("userId"),
                CONSTRAINT "PK_f3d0102938daf31453055518bbb" PRIMARY KEY ("id")
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
        await queryRunner.query(`
            DROP TABLE "ledger_recalculation"
        `);
}
}
