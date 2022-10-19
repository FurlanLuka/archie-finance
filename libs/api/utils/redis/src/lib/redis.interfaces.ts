import { InjectionToken, OptionalFactoryDependency } from '@nestjs/common';
import { Type } from '@nestjs/common/interfaces/type.interface';
import { DynamicModule } from '@nestjs/common/interfaces/modules/dynamic-module.interface';
import { ForwardReference } from '@nestjs/common/interfaces/modules/forward-reference.interface';

export { ExecutionError } from 'redlock';

export interface RedisConfig {
  url: string;
  keyPrefix: string;
}

export interface RedisOptions {
  imports: Array<
    Type | DynamicModule | Promise<DynamicModule> | ForwardReference
  >;
  inject: (InjectionToken | OptionalFactoryDependency)[];
  useFactory: (...args: unknown[]) => RedisConfig;
}
