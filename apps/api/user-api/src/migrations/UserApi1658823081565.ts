import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserApi1658823081565 implements MigrationInterface {
  name = 'UserApi1658823081565';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "kyc" (
                "userId" character varying NOT NULL,
                "firstName" character varying NOT NULL,
                "lastName" character varying NOT NULL,
                "dateOfBirth" character varying NOT NULL,
                "addressStreet" character varying NOT NULL,
                "addressStreetNumber" character varying NOT NULL,
                "addressLocality" character varying NOT NULL,
                "addressCountry" character varying NOT NULL,
                "addressRegion" character varying NOT NULL,
                "addressPostalCode" character varying NOT NULL,
                "phoneNumberCountryCode" character varying,
                "phoneNumber" character varying,
                "ssn" character varying NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_ca948073ed4a3ba22030d37b3db" PRIMARY KEY ("userId")
            )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TABLE "kyc"
        `);
  }
}
