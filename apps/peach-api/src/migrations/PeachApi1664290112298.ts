
import { MigrationInterface, QueryRunner } from "typeorm";

export class PeachApi1664290112298 implements MigrationInterface {
name = 'PeachApi1664290112298'

public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "last_credit_limit_update" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "calculatedAt" TIMESTAMP WITH TIME ZONE NOT NULL,
                "borrowerUuid" uuid NOT NULL,
                CONSTRAINT "REL_7e75f37395172c20026d86e43b" UNIQUE ("borrowerUuid"),
                CONSTRAINT "PK_9450ba6f024ded9d6694e15ffc9" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_8142e3d323fadb4acb4580a49d" ON "last_credit_limit_update" ("calculatedAt")
        `);
        await queryRunner.query(`
            ALTER TABLE "last_credit_limit_update"
            ADD CONSTRAINT "FK_7e75f37395172c20026d86e43b4" FOREIGN KEY ("borrowerUuid") REFERENCES "borrower"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
}

public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE "last_credit_limit_update"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_8142e3d323fadb4acb4580a49d"
        `);
        await queryRunner.query(`
            ALTER TABLE "last_credit_limit_update" DROP CONSTRAINT "FK_7e75f37395172c20026d86e43b4"
        `);
}

}

