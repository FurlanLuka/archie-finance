export function generateTarget(projectName: string): object {
  return {
    'build-openapi': {
      executor: 'nx:run-commands',
      options: {
        command: `npm run build ${projectName} && RUN_MIGRATIONS=false node dist/apps/${projectName}/main build-swagger`,
      },
    },
    'generate-migration': {
      executor: 'nx:run-commands',
      options: {
        command: `npm run build ${projectName} && node dist/apps/${projectName}/main generate-migration`,
      },
    },
    'build-docker': {
      executor: '@archie/plugin/deployment:docker-build',
    },
    'test-integration': {
      executor: '@nrwl/jest:jest',
      outputs: [`coverage/apps/${projectName}`],
      options: {
        jestConfig: `apps/${projectName}/jest.config.ts`,
        passWithNoTests: true,
        runInBand: true,
      },
    },
    deploy: {
      executor: '@archie/plugin/deployment:deploy',
    },
  };
}
