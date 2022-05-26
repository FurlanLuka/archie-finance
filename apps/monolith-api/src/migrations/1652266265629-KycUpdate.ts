import { MigrationInterface, QueryRunner } from 'typeorm';

export class KycUpdate1652266265629 implements MigrationInterface {
  name = 'KycUpdate1652266265629';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`kyc\` ADD \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`kyc\` ADD \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`,
    );
    await queryRunner.query(`ALTER TABLE \`kyc\` DROP COLUMN \`ssnDigits\``);
    await queryRunner.query(
      `ALTER TABLE \`kyc\` ADD \`ssnDigits\` varchar(255) NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`kyc\` DROP COLUMN \`ssnDigits\``);
    await queryRunner.query(
      `ALTER TABLE \`kyc\` ADD \`ssnDigits\` int NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE \`kyc\` DROP COLUMN \`updatedAt\``);
    await queryRunner.query(`ALTER TABLE \`kyc\` DROP COLUMN \`createdAt\``);
  }
}
