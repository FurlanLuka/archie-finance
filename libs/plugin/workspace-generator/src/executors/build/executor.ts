import { BuildExecutorSchema } from './schema';
import { ExecutorResult } from '../executor.interfaces';

export default async function runExecutor(
  options: BuildExecutorSchema,
): Promise<ExecutorResult> {
  console.log('Executor ran for Build', options);
  return {
    success: true,
  };
}
