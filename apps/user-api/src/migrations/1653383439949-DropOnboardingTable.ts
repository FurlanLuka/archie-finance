import { MigrationInterface, QueryRunner } from 'typeorm';

export class KycAddState1653383439849 implements MigrationInterface {
  name = 'DropOnboardingTable1653383439949';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`onboarding\``);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`onboarding\` (\`userId\` varchar(255) NOT NULL, \`kycStage\` tinyint NOT NULL DEFAULT 0, \`emailVerificationStage\` tinyint NOT NULL DEFAULT 0, \`collateralizationStage\` tinyint NOT NULL DEFAULT 0, \`cardActivationStage\` tinyint NOT NULL DEFAULT 0, \`completed\` tinyint NOT NULL DEFAULT 0, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`userId\`)) ENGINE=InnoDB`,
    );
  }
}
