import { Tree } from '@nrwl/devkit';
import { readWorkspace } from 'nx/src/generators/utils/project-configuration';

export function testeEnvironmentGenerator(tree: Tree) {
  const workspace = readWorkspace(tree);

  const projects = Object.keys(workspace.projects).map((projectKey) => {
    console.log(workspace.projects[projectKey].root);
  });
}

export default testeEnvironmentGenerator;
