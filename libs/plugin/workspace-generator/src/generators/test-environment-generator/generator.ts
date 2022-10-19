import { Tree } from '@nrwl/devkit';
import { readWorkspace } from 'nx/src/generators/utils/project-configuration';

export function testEnvironmentGenerator(tree: Tree): void {
  const workspace = readWorkspace(tree);

  const projects = Object.keys(workspace.projects).flatMap((projectKey) => {
    const project = workspace.projects[projectKey];

    if (project.root.includes('apps/')) {
      return [project];
    }

    return [];
  });

  projects.forEach((project) => {
    const integrationEnvironmentFilePath = `${project.root}/.env.integration`;
    if (tree.exists(integrationEnvironmentFilePath)) {
      tree.rename(integrationEnvironmentFilePath, `${project.root}/.env`);
    }
  });
}

export default testEnvironmentGenerator;
