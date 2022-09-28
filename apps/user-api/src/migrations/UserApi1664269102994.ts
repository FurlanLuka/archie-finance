
import { MigrationInterface, QueryRunner } from "typeorm";

export class UserApi1664269102994 implements MigrationInterface {
name = 'UserApi1664269102994'

public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "kyc"
            ADD "aptUnit" character varying
        `);
}

public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "kyc" DROP COLUMN "aptUnit"
        `);
}

}

