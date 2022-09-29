export { ExecutionError } from 'redlock';

export interface RedisConfig {
  url: string;
  keyPrefix: string;
}

export interface RedisOptions {
  // eslint-ignore-next-line
  imports: any[];
  // eslint-ignore-next-line
  inject: any[];
  // eslint-ignore-next-line
  useFactory: (...args: any[]) => RedisConfig;
}
