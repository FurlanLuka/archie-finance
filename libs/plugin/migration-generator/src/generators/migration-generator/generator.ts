import { getWorkspaceLayout, Tree } from '@nrwl/devkit';
import { MicroserviceModuleGeneratorSchema } from './schema';
import { exec } from 'child_process';
import { promisify } from 'util';

interface NormalizedSchema extends MicroserviceModuleGeneratorSchema {
  serviceRoot: string;
}

function normalizeOptions(
  tree: Tree,
  options: MicroserviceModuleGeneratorSchema,
): NormalizedSchema {
  const serviceRoot = `${getWorkspaceLayout(tree).appsDir}/${
    options.projectName
  }`;

  return {
    ...options,
    serviceRoot,
  };
}

const MIGRATION_START_OUTPUT = '_______START-MIGRATION-CODE_______';
const MIGRATION_END_OUTPUT = '_______END-MIGRATION-CODE_______';

export default async function (
  tree: Tree,
  options: MicroserviceModuleGeneratorSchema,
) {
  const normalizedOptions = normalizeOptions(tree, options);

  const execute = promisify(exec);

  const { stdout } = await execute(
    `npx nx run ${normalizedOptions.projectName}:generate-migration`,
  );

  const migrationCode: string = stdout
    .split(MIGRATION_START_OUTPUT)[1]
    .split(MIGRATION_END_OUTPUT)[0];

  const migrationName: string = migrationCode.match(
    /(?<=name = ').*?(?=')/gs,
  )[0];

  tree.write(
    `${normalizedOptions.serviceRoot}/src/migrations/${migrationName}.ts`,
    migrationCode,
  );

  // visitNotIgnoredFiles(tree, `${normalizedOptions.serviceRoot}/src/`, (path) => console.log(path))

  // addFiles(tree, normalizedOptions);
}
