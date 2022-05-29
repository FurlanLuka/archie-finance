import { MigrationInterface, QueryRunner } from 'typeorm';

export class KycAddState1653383439849 implements MigrationInterface {
  name = 'KycAddState1653383439849';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`kyc\` DROP COLUMN \`location\``);
    await queryRunner.query(
      `ALTER TABLE \`kyc\` ADD \`country\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`kyc\` ADD \`state\` varchar(255) NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`kyc\` DROP COLUMN \`state\``);
    await queryRunner.query(`ALTER TABLE \`kyc\` DROP COLUMN \`country\``);
    await queryRunner.query(
      `ALTER TABLE \`kyc\` ADD \`location\` varchar(255) NOT NULL`,
    );
  }
}
