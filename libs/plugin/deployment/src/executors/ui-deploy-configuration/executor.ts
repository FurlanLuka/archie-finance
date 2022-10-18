import { ExecutorContext, logger } from '@nrwl/devkit';
import { readFileSync } from 'fs';
import { DeployConfigurationSchema } from './schema';
import { execSync } from 'child_process';

export default async function runExecutor(
  { environment }: DeployConfigurationSchema,
  { projectName, workspace }: ExecutorContext,
) {
  if (!projectName) {
    logger.error(`Project name is not available.`);

    return { success: false };
  }

  const projectConfig = workspace.projects[projectName];

  const data = JSON.parse(readFileSync(
    `${projectConfig.root}/deployment-${environment}.json`,
    'utf-8'
  ));

  Object.keys(data).forEach(key => {
    logger.info(key)
    execSync(`echo "${key}=${data[key]}" >> "$GITHUB_ENV"`)
  })

  return {
    success: true,
  };
}
