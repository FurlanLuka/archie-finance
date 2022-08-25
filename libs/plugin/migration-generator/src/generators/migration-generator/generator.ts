import {
  generateFiles,
  getWorkspaceLayout,
  offsetFromRoot,
  Tree,
} from '@nrwl/devkit';
import { MicroserviceModuleGeneratorSchema } from './schema';
import { exec } from 'child_process';
import { promisify } from 'util';
import path = require('node:path');

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

function addFiles(tree: Tree, options: NormalizedSchema) {
  const templateOptions = {
    ...options,
    offsetFromRoot: offsetFromRoot(options.serviceRoot),
  };
  generateFiles(
    tree,
    path.join(__dirname, 'files'),
    options.serviceRoot,
    templateOptions,
  );
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
    { maxBuffer: 1024 * 500 },
  );

  console.log(stdout);

  const migrationCode: string = stdout
    .split(MIGRATION_START_OUTPUT)[1]
    .split(MIGRATION_END_OUTPUT)[0];

  const migrationName: string = (<RegExpMatchArray>(
    migrationCode.match(/(?<=name = ').*?(?=')/gs)
  ))[0];

  const migrationsDirectory = `${normalizedOptions.serviceRoot}/src/migrations`;

  tree.write(`${migrationsDirectory}/${migrationName}.ts`, migrationCode);

  const migrations = tree
    .children(migrationsDirectory)
    .map((migrationFile) => migrationFile.slice(0, -3));

  tree.delete(`${normalizedOptions.serviceRoot}/src/migrations.ts`);

  addFiles(tree, {
    ...normalizedOptions,
    migrations,
  });
}
