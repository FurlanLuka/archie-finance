export function generateTarget(projectName: string) {
  return {
    'build-openapi': {
      executor: '@nrwl/workspace:run-commands',
      options: {
        command: `npm run build ${projectName} && node dist/apps/${projectName}/main build-swagger`,
      },
    },
    'generate-migration': {
      executor: '@nrwl/workspace:run-commands',
      options: {
        command: `npm run build ${projectName} && node dist/apps/${projectName}/main generate-migration`,
      },
    },
    'build-docker': {
      executor: '@archie/plugin/deployment:docker-build',
    },
    deploy: {
      executor: '@archie/plugin/deployment:deploy',
    },
  };
}