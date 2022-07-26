import { generateMigration } from './lib/generate-migration';
import { startService } from './lib/start-service';

export async function start(appName: string, module: unknown) {
  const generateMigrations: boolean = process.argv.some(
    (arg) => arg === 'generate-migration',
  );

  if (generateMigrations) {
    await generateMigration(appName, module);
  } else {
    await startService(appName, module);
  }
}
