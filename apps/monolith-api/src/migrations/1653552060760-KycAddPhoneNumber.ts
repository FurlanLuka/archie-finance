import { MigrationInterface, QueryRunner } from 'typeorm';

export class KycAddPhoneNumber1653552060760 implements MigrationInterface {
  name = 'KycAddPhoneNumber1653552060760';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`kyc\` DROP COLUMN \`fullLegalName\``,
    );
    await queryRunner.query(`ALTER TABLE \`kyc\` DROP COLUMN \`ssnDigits\``);
    await queryRunner.query(`ALTER TABLE \`kyc\` DROP COLUMN \`country\``);
    await queryRunner.query(`ALTER TABLE \`kyc\` DROP COLUMN \`state\``);
    await queryRunner.query(
      `ALTER TABLE \`kyc\` ADD \`firstName\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`kyc\` ADD \`lastName\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`kyc\` ADD \`address\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`kyc\` ADD \`phoneNumberCountryCode\` varchar(255) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`kyc\` ADD \`phoneNumber\` varchar(255) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`kyc\` ADD \`ssn\` varchar(255) NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`kyc\` DROP COLUMN \`ssn\``);
    await queryRunner.query(`ALTER TABLE \`kyc\` DROP COLUMN \`phoneNumber\``);
    await queryRunner.query(
      `ALTER TABLE \`kyc\` DROP COLUMN \`phoneNumberCountryCode\``,
    );
    await queryRunner.query(`ALTER TABLE \`kyc\` DROP COLUMN \`address\``);
    await queryRunner.query(`ALTER TABLE \`kyc\` DROP COLUMN \`lastName\``);
    await queryRunner.query(`ALTER TABLE \`kyc\` DROP COLUMN \`firstName\``);
    await queryRunner.query(
      `ALTER TABLE \`kyc\` ADD \`state\` varchar(255) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`kyc\` ADD \`country\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`kyc\` ADD \`ssnDigits\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`kyc\` ADD \`fullLegalName\` varchar(255) NOT NULL`,
    );
  }
}
