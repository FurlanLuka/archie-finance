import { GeneratorCallback, getWorkspaceLayout, joinPathFragments, Tree } from '@nrwl/devkit';
import { MicroserviceGenerator } from './schema';
import { initGenerator } from '@nrwl/nest';
import { applicationGenerator as nodeApplicationGenerator } from '@nrwl/node';
import { createAppFiles, createLibFiles } from './lib/create-files';
import { updateTsConfig } from './lib/update-tsconfig';
import { runTasksInSerial } from '@nrwl/workspace/src/utilities/run-tasks-in-serial';
import { microserviceModuleGenerator } from '../microservice-module-generator/generator';
import deploymentConfigGenerator from '../deployment-config-generator/generator';
import microserviceProjectTargetGenerator from '../microservice-project-target-generator/generator';

export interface NormalizedSchema extends MicroserviceGenerator {
  projectRoot: string;
}

function normalizeOptions(tree: Tree, options: MicroserviceGenerator): NormalizedSchema {
  const projectRoot = joinPathFragments(getWorkspaceLayout(tree).appsDir, 'api', options.name);

  return {
    ...options,
    projectRoot,
  };
}

export default async function (tree: Tree, options: MicroserviceGenerator): Promise<GeneratorCallback> {
  const normalizedOptions = normalizeOptions(tree, options);

  const initTask = await initGenerator(tree, {
    unitTestRunner: 'jest',
    skipFormat: true,
  });

  const nodeApplicationTask = await nodeApplicationGenerator(tree, {
    unitTestRunner: 'jest',
    name: normalizedOptions.name,
    directory: 'api',
    tags: `scope:api:app:${normalizedOptions.name}`,
  });

  createAppFiles(tree, normalizedOptions);
  updateTsConfig(tree, normalizedOptions);

  const createConstantsLibraryTask = await microserviceModuleGenerator(tree, {
    projectName: options.name,
    name: 'constants',
    moduleType: 'SHARED',
  });

  const createDataTransferObjectsLibraryTask = await microserviceModuleGenerator(tree, {
    projectName: options.name,
    name: 'data-transfer-objects',
    moduleType: 'SHARED_WITH_UI',
  });

  const createTestDataLibraryTask = await microserviceModuleGenerator(tree, {
    projectName: options.name,
    name: 'test-data',
    moduleType: 'TEST_DATA_MODULE',
  });

  createLibFiles(tree, normalizedOptions);

  deploymentConfigGenerator(tree, {
    projectName: options.name,
  });

  microserviceProjectTargetGenerator(tree, {
    projectName: options.name,
  });

  return runTasksInSerial(
    initTask,
    nodeApplicationTask,
    createConstantsLibraryTask,
    createDataTransferObjectsLibraryTask,
    createTestDataLibraryTask,
  );
}
