
import { MigrationInterface, QueryRunner } from "typeorm";

export class ReferralSystemApi1658823317486 implements MigrationInterface {
name = 'ReferralSystemApi1658823317486'

public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "waitlist" (
                "id" uuid NOT NULL,
                "emailAddress" character varying NOT NULL,
                "emailIdentifier" character varying NOT NULL,
                "isEmailVerified" boolean NOT NULL DEFAULT false,
                "referralCode" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "referrer" uuid,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_973cfbedc6381485681d6a6916c" PRIMARY KEY ("id")
            )
        `);
}

public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE "waitlist"
        `);
}

}

