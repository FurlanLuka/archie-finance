import { IsNull, MigrationInterface, QueryRunner } from 'typeorm';
import { CryptoService } from '@archie/api/utils/crypto';

export class UserApi1664184306209 implements MigrationInterface {
  name = 'UserApi1664184306209';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const cryptoService = new CryptoService({
      encryptionKey: process.env.ENCRYPTION_KEY,
    });

    await queryRunner.query(`
        ALTER TABLE "kyc"
            ADD "declaredIncome" character varying
        `);

    await queryRunner.manager.update(
      'kyc',
      {
        declaredIncome: IsNull(),
      },
      {
        declaredIncome: cryptoService.encrypt('0'),
      },
    );

    await queryRunner.query(`
            ALTER TABLE "kyc"
            ALTER COLUMN "declaredIncome" SET NOT NULL 
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "kyc" DROP COLUMN "declaredIncome"
        `);
  }
}
