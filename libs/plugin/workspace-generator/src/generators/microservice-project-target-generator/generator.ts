import { getWorkspaceLayout, Tree, joinPathFragments } from '@nrwl/devkit';
import { MicroserviceProjectTargetGenerator } from './schema';
import { updateProjectConfiguration } from './lib/update-project';

export interface NormalizedSchema extends MicroserviceProjectTargetGenerator {
  projectRoot: string;
}

function normalizeOptions(
  tree: Tree,
  options: MicroserviceProjectTargetGenerator,
): NormalizedSchema {
  const projectRoot = joinPathFragments(
    getWorkspaceLayout(tree).appsDir,
    options.projectName,
  );

  return {
    ...options,
    projectRoot,
  };
}

export function microserviceProjectTargetGenerator(
  tree: Tree,
  options: MicroserviceProjectTargetGenerator,
): void {
  const normalizedOptions = normalizeOptions(tree, options);

  updateProjectConfiguration(tree, normalizedOptions);
}

export default microserviceProjectTargetGenerator;
