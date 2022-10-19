import { NestFactory } from '@nestjs/core';
import {
  MigrationGeneratorModule,
  MigrationGeneratorService,
} from '@archie/api/utils/migration-generator';
import { Import } from './microservice.interfaces';

export async function generateMigration(
  appName: string,
  appModule: Import,
): Promise<void> {
  const app = await NestFactory.create(
    MigrationGeneratorModule.register(appModule),
  );

  const migrationGeneratorService = app.get(MigrationGeneratorService);

  await migrationGeneratorService.generateMigration(appName);
  await app.close();

  process.exit(0);
}
