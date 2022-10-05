import { Tree } from '@nrwl/devkit';
import { readWorkspace } from 'nx/src/generators/utils/project-configuration';

export function testeEnvironmentGenerator(tree: Tree) {
  const workspace = readWorkspace(tree);

  const projects = Object.keys(workspace.projects).flatMap((projectKey) => {
    const project = workspace.projects[projectKey];

    if (project.root.includes('apps/')) {
      return [project];
    }

    return [];
  });

  console.log(projects)
}

export default testeEnvironmentGenerator;
