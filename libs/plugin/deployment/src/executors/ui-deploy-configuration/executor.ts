import { ExecutorContext, logger } from '@nrwl/devkit';
import { readFileSync } from 'fs';
import { DeployConfigurationSchema } from './schema';
import { execSync } from 'child_process';
import { ExecutorResult } from '../executor.interfaces';

export default async function runExecutor(
  { environment }: DeployConfigurationSchema,
  { projectName, workspace }: ExecutorContext,
): Promise<ExecutorResult> {
  if (projectName === undefined) {
    logger.error(`Project name is not available.`);

    return { success: false };
  }

  const projectConfig = workspace.projects[projectName];

  const data = JSON.parse(
    readFileSync(
      `${projectConfig.root}/deployment-${environment}.json`,
      'utf-8',
    ),
  );

  Object.keys(data).forEach((key) => {
    logger.info(`Executing: ${`echo "${key}=${data[key]}" >> "$GITHUB_ENV"`}`);
    execSync(`echo "${key}=${data[key]}" >> $GITHUB_ENV`);
  });

  return {
    success: true,
  };
}
