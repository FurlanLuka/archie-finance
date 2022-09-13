import { NestFactory } from '@nestjs/core';
import {
  MigrationGeneratorModule,
  MigrationGeneratorService,
} from '@archie/api/utils/migration-generator';

export async function generateMigration(
  appName: string,
  appModule: unknown,
): Promise<void> {
  const app = await NestFactory.create(
    MigrationGeneratorModule.register(appModule),
  );

  const migrationGeneratorService = app.get(MigrationGeneratorService);

  await migrationGeneratorService.generateMigration(appName);
  await app.close();

  process.exit(0);
}
