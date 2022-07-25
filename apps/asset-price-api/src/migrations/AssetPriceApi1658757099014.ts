
import { MigrationInterface, QueryRunner } from "typeorm";

export class AssetPriceApi1658757099014 implements MigrationInterface {
name = 'AssetPriceApi1658757099014'

public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "asset_price" (
                "asset" character varying NOT NULL,
                "price" double precision NOT NULL,
                "dailyChange" double precision,
                "currency" character varying NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_42afd6a022e3436e6469cba7d9e" PRIMARY KEY ("asset")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "asset_price_history" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "asset" character varying NOT NULL,
                "price" double precision NOT NULL,
                "dailyChange" double precision,
                "currency" character varying NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_26d98c4a4679bbe91a268302cd7" PRIMARY KEY ("id")
            )
        `);
}

public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE "asset_price"
        `);
        await queryRunner.query(`
            DROP TABLE "asset_price_history"
        `);
}

}

