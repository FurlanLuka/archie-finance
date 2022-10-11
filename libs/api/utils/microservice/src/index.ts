import { generateMigration } from './lib/generate-migration';
import { startService, StartServiceOptions } from './lib/start-service';
import { INestApplication } from '@nestjs/common';

export async function start(
  appName: string,
  module: unknown,
  options?: StartServiceOptions,
): Promise<INestApplication | void> {
  const generateMigrations: boolean = process.argv.some(
    (arg) => arg === 'generate-migration',
  );

  if (generateMigrations) {
    await generateMigration(appName, module);
  } else {
    await startService(appName, module, options);
  }
}
