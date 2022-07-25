import {
  formatFiles,
  generateFiles,
  getWorkspaceLayout,
  offsetFromRoot,
  Tree,
} from '@nrwl/devkit';
import * as path from 'path';
import { DeploymentConfigGeneratorSchema } from './schema';

interface NormalizedSchema extends DeploymentConfigGeneratorSchema {
  projectRoot: string;
}

function normalizeOptions(
  tree: Tree,
  options: DeploymentConfigGeneratorSchema,
): NormalizedSchema {
  const projectRoot = `${getWorkspaceLayout(tree).appsDir}/${
    options.projectName
  }`;

  return {
    ...options,
    projectRoot,
  };
}

function addFiles(tree: Tree, options: NormalizedSchema) {
  const templateOptions = {
    ...options,
    offsetFromRoot: offsetFromRoot(options.projectRoot),
  };
  generateFiles(
    tree,
    path.join(__dirname, 'files'),
    options.projectRoot,
    templateOptions,
  );
}

export default async function (
  tree: Tree,
  options: DeploymentConfigGeneratorSchema,
) {
  const normalizedOptions = normalizeOptions(tree, options);

  addFiles(tree, normalizedOptions);
}
