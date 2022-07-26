
import { MigrationInterface, QueryRunner } from "typeorm";

export class OnboardingApi1658823435686 implements MigrationInterface {
name = 'OnboardingApi1658823435686'

public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "onboarding" (
                "userId" character varying NOT NULL,
                "kycStage" boolean NOT NULL DEFAULT false,
                "emailVerificationStage" boolean NOT NULL DEFAULT false,
                "collateralizationStage" boolean NOT NULL DEFAULT false,
                "cardActivationStage" boolean NOT NULL DEFAULT false,
                "mfaEnrollmentStage" boolean NOT NULL DEFAULT false,
                "completed" boolean NOT NULL DEFAULT false,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_f2baf27f040b7c72a6d93a0cf9a" PRIMARY KEY ("userId")
            )
        `);
}

public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE "onboarding"
        `);
}

}

