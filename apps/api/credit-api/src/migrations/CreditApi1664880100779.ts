import { MigrationInterface, QueryRunner } from 'typeorm';
export class CreditApi1664880100779 implements MigrationInterface {
  name = 'CreditApi1664880100779';
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.renameTable(
      'last_adjustment',
      'last_debit_card_update_meta',
    );
    await queryRunner.renameColumn(
      'last_debit_card_update_meta',
      'availableCreditCalculatedAt',
      'adjustmentCalculatedAt',
    );

    await queryRunner.query(`
        ALTER TABLE "last_debit_card_update_meta"
           ADD "cardStatusChangedAt" TIMESTAMP NOT NULL DEFAULT now()
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.renameTable(
      'last_debit_card_update_meta',
      'last_adjustment',
    );
    await queryRunner.renameColumn(
      'last_adjustment',
      'adjustmentCalculatedAt',
      'availableCreditCalculatedAt',
    );
    await queryRunner.dropColumn('last_adjustment', 'cardStatusChangedAt');
  }
}
