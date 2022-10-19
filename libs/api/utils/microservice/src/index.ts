import { generateMigration } from './lib/generate-migration';
import { startService, StartServiceOptions } from './lib/start-service';
import { Import } from './lib/microservice.interfaces';
import { generateOpenapi } from './lib/generate-openapi';

export async function start(
  appName: string,
  module: Import,
  options?: StartServiceOptions,
): Promise<void> {
  const generateMigrations: boolean = process.argv.some(
    (arg) => arg === 'generate-migration',
  );
  const buildSwagger: boolean = process.argv.some(
    (arg) => arg === 'build-swagger',
  );

  if (buildSwagger) {
    await generateOpenapi(module);
  } else if (generateMigrations) {
    await generateMigration(appName, module);
  } else {
    await startService(appName, module, options);
  }
}
