import { Type } from '@nestjs/common/interfaces/type.interface';
import { DynamicModule } from '@nestjs/common/interfaces/modules/dynamic-module.interface';
import { ForwardReference } from '@nestjs/common/interfaces/modules/forward-reference.interface';

export type Import =
  | Type
  | DynamicModule
  | Promise<DynamicModule>
  | ForwardReference;
