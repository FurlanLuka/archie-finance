import { getWorkspaceLayout, joinPathFragments, Tree } from '@nrwl/devkit';
import { MicroserviceGenerator } from './schema';
import { initGenerator } from '@nrwl/nest';
import { applicationGenerator as nodeApplicationGenerator } from '@nrwl/node';
import { createAppFiles } from './lib/create-files';
import { updateTsConfig } from './lib/update-tsconfig';
import { runTasksInSerial } from '@nrwl/workspace/src/utilities/run-tasks-in-serial';

export interface NormalizedSchema extends MicroserviceGenerator {
  projectRoot: string;
  constantsRoot: string;
}

function normalizeOptions(
  tree: Tree,
  options: MicroserviceGenerator,
): NormalizedSchema {
  const projectRoot = joinPathFragments(
    getWorkspaceLayout(tree).appsDir,
    options.name
  );

  const constantsRoot = joinPathFragments(
    getWorkspaceLayout(tree).libsDir,
    `${options.name}/constants`
  );

  return {
    ...options,
    projectRoot,
    constantsRoot,
  };
}

export default async function (tree: Tree, options: MicroserviceGenerator) {
  const normalizedOptions = normalizeOptions(tree, options);

  const initTask = await initGenerator(tree, {
    unitTestRunner: 'jest',
    skipFormat: true,
  })

  const nodeApplicationTask = await nodeApplicationGenerator(tree, {
    unitTestRunner: 'jest',
    name: normalizedOptions.name,
  })

  createAppFiles(tree, normalizedOptions);
  updateTsConfig(tree, normalizedOptions);

  return runTasksInSerial(initTask, nodeApplicationTask);
}
