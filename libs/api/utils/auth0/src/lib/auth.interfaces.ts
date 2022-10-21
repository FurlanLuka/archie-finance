import { Type } from '@nestjs/common/interfaces/type.interface';
import { DynamicModule } from '@nestjs/common/interfaces/modules/dynamic-module.interface';
import { ForwardReference } from '@nestjs/common/interfaces/modules/forward-reference.interface';
import { InjectionToken, OptionalFactoryDependency } from '@nestjs/common';

export interface AuthConfig {
  domain: string;
  audience: string;
}

export interface AuthOptions {
  imports: Array<
    Type | DynamicModule | Promise<DynamicModule> | ForwardReference
  >;
  inject: (InjectionToken | OptionalFactoryDependency)[];
  useFactory: (...args: unknown[]) => AuthConfig;
}

export interface RequestWithUser extends Request {
  user?: {
    sub: string;
    scope: string;
  };
}
