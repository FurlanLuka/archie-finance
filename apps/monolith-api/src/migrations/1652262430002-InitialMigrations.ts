import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialMigrations1652262430002 implements MigrationInterface {
  name = 'InitialMigrations1652262430002';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`collateral_deposit\` (\`transactionId\` varchar(255) NOT NULL, \`userId\` varchar(255) NOT NULL, \`asset\` varchar(255) NOT NULL, \`amount\` float NOT NULL, \`status\` varchar(255) NOT NULL, \`destinationAddress\` varchar(255) NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`transactionId\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`collateral\` (\`id\` varchar(36) NOT NULL, \`userId\` varchar(255) NOT NULL, \`asset\` varchar(255) NOT NULL, \`amount\` float NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`kyc\` (\`userId\` varchar(255) NOT NULL, \`fullLegalName\` varchar(255) NOT NULL, \`dateOfBirth\` varchar(255) NOT NULL, \`location\` varchar(255) NOT NULL, \`ssnDigits\` int NOT NULL, PRIMARY KEY (\`userId\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`onboarding\` (\`userId\` varchar(255) NOT NULL, \`kycStage\` tinyint NOT NULL DEFAULT 0, \`emailVerificationStage\` tinyint NOT NULL DEFAULT 0, \`collateralizationStage\` tinyint NOT NULL DEFAULT 0, \`cardActivationStage\` tinyint NOT NULL DEFAULT 0, \`completed\` tinyint NOT NULL DEFAULT 0, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`userId\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`deposit_address\` (\`id\` varchar(36) NOT NULL, \`userId\` varchar(255) NOT NULL, \`asset\` varchar(255) NOT NULL, \`address\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`user_vault_account\` (\`userId\` varchar(255) NOT NULL, \`vaultAccountId\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`userId\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`user_vault_account\``);
    await queryRunner.query(`DROP TABLE \`deposit_address\``);
    await queryRunner.query(`DROP TABLE \`onboarding\``);
    await queryRunner.query(`DROP TABLE \`kyc\``);
    await queryRunner.query(`DROP TABLE \`collateral\``);
    await queryRunner.query(`DROP TABLE \`collateral_deposit\``);
  }
}
