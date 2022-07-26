
import { MigrationInterface, QueryRunner } from "typeorm";

export class AssetPriceApi1658825830711 implements MigrationInterface {
name = 'AssetPriceApi1658825830711'

public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "asset_price_history"
            ALTER COLUMN "dailyChange"
            SET NOT NULL
        `);
}

public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "asset_price_history"
            ALTER COLUMN "dailyChange" DROP NOT NULL
        `);
}

}

