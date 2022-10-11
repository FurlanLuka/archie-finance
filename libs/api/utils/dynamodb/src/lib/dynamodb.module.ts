import { DynamicModule, Module } from '@nestjs/common';
import { DynamodbOptions } from './dynamodb.interfaces';
import { DynamodbService } from './dynamodb.service';

@Module({})
export class DynamodbModule {
  static register(options: DynamodbOptions): DynamicModule {
    return {
      module: DynamodbModule,
      imports: [],
      providers: [
        {
          inject: options.inject,
          provide: 'CONFIG_OPTIONS',
          useFactory: options.useFactory,
        },
        DynamodbService,
      ],
      exports: [DynamodbService],
      global: true,
    };
  }
}
