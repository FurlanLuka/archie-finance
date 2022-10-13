export { ExecutionError } from 'redlock';

export interface DynamodbConfig {
  region: string;
  accessKeyId: string;
  accessKeySecret: string;
  endpoint?: string;
}

export interface DynamodbOptions {
  // eslint-ignore-next-line
  imports: any[];
  // eslint-ignore-next-line
  inject: any[];
  // eslint-ignore-next-line
  useFactory: (...args: any[]) => DynamodbConfig;
}
