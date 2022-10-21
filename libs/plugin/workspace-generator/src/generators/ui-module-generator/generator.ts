import {
  getWorkspaceLayout,
  Tree,
  joinPathFragments,
  GeneratorCallback,
} from '@nrwl/devkit';
import { UiModuleGeneratorSchema } from './schema';
import { libraryGenerator } from '@nrwl/react';

import { Linter } from '@nrwl/linter';
import { createLibFiles } from './lib/create-files';
import { runTasksInSerial } from '@nrwl/workspace/src/utilities/run-tasks-in-serial';

export interface NormalizedSchema extends UiModuleGeneratorSchema {
  libraryRoot: string;
  projectFolder: string;
}

function getProjectFolder(
  moduleType: string,
  projectName?: string,
): string {
  if (moduleType === 'PROJECT') {
    return projectName!.replace('ui-', '');
  }

  if (moduleType === 'PROJECT_FEATURE') {
    return `${projectName!.replace('ui-', '')}/feature`;
  }

  if (moduleType === 'SHARED') {
    return 'shared';
  }

  return `shared/data-acess`;
}

function normalizeOptions(
  tree: Tree,
  options: UiModuleGeneratorSchema,
): NormalizedSchema {
  const projectFolder = getProjectFolder(
    options.moduleType,
    options.projectName,
  );

  const libraryRoot = joinPathFragments(
    getWorkspaceLayout(tree).libsDir,
    'ui',
    projectFolder,
    options.moduleName,
  );

  return {
    ...options,
    libraryRoot,
    projectFolder,
  };
}

export async function uiModuleGenerator(
  tree: Tree,
  options: UiModuleGeneratorSchema,
): Promise<GeneratorCallback> {
  const normalizedOptions = normalizeOptions(tree, options);

  const libraryGeneratorTask = await libraryGenerator(tree, {
    name: normalizedOptions.moduleName,
    standaloneConfig: true,
    skipTsConfig: false,
    skipFormat: false,
    buildable: false,
    style: 'styled-components',
    directory: `ui/${normalizedOptions.projectFolder}`,
    importPath: `@archie/ui/${normalizedOptions.projectFolder}/${normalizedOptions.moduleName}`,
    linter: Linter.EsLint,
    publishable: false,
    unitTestRunner: 'none',
  });

  createLibFiles(tree, normalizedOptions);

  return runTasksInSerial(libraryGeneratorTask);
}

export default uiModuleGenerator;
