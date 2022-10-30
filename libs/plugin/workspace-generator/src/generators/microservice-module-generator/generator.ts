import {
  getWorkspaceLayout,
  Tree,
  joinPathFragments,
  GeneratorCallback,
} from '@nrwl/devkit';
import { MicroserviceModuleGeneratorSchema } from './schema';
import { libraryGenerator } from '@nrwl/nest';
import { Linter } from '@nrwl/linter';
import { deleteFiles } from './lib/delete-files';
import { createLibFiles } from './lib/create-files';
import { runTasksInSerial } from '@nrwl/workspace/src/utilities/run-tasks-in-serial';

export interface NormalizedSchema extends MicroserviceModuleGeneratorSchema {
  projectRoot: string;
  libraryRoot: string;
}

function normalizeOptions(
  tree: Tree,
  options: MicroserviceModuleGeneratorSchema,
): NormalizedSchema {
  const projectRoot = joinPathFragments(
    getWorkspaceLayout(tree).appsDir,
    options.projectName,
  );

  const libraryRoot = joinPathFragments(
    getWorkspaceLayout(tree).libsDir,
    `api/${options.projectName}/${options.name}`,
  );

  return {
    ...options,
    projectRoot,
    libraryRoot,
  };
}

export async function microserviceModuleGenerator(
  tree: Tree,
  options: MicroserviceModuleGeneratorSchema,
): Promise<GeneratorCallback> {
  const normalizedOptions = normalizeOptions(tree, options);

  const tags: string[] = [];

  if (options.moduleType === 'NORMAL') {
    tags.push(`scope:api:lib:${options.projectName}`);
  } else if (options.moduleType === 'SHARED') {
    tags.push(
      `scope:api:lib:${options.projectName}:shared`,
      `scope:api:lib:shared`,
    );
  } else if (options.moduleType === 'SHARED_WITH_UI') {
    tags.push(
      `scope:api:lib:${options.projectName}:shared`,
      `scope:api:lib:shared`,
      'scope:ui:lib:shared',
    );
  } else {
    tags.push(`scope:api:lib:test-data`);
  }

  const libraryGeneratorTask = await libraryGenerator(tree, {
    name: normalizedOptions.name,
    standaloneConfig: true,
    buildable: false,
    controller: false,
    directory: `api/${normalizedOptions.projectName}`,
    importPath: `@archie/api/${normalizedOptions.projectName}/${normalizedOptions.name}`,
    linter: Linter.EsLint,
    service: true,
    publishable: false,
    tags: tags.join(','),
  });

  deleteFiles(tree, normalizedOptions);
  createLibFiles(tree, normalizedOptions);

  return runTasksInSerial(libraryGeneratorTask);
}

export default microserviceModuleGenerator;
