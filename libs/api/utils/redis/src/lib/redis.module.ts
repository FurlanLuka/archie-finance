import { DynamicModule, Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { RedisOptions } from './redis.interfaces';

@Module({})
export class RedisModule {
  static register(options: RedisOptions): DynamicModule {
    return {
      module: RedisModule,
      imports: [],
      providers: [
        {
          inject: options.inject,
          provide: 'CONFIG_OPTIONS',
          useFactory: options.useFactory,
        },
        RedisService,
      ],
      exports: [RedisService],
      global: true,
    };
  }
}
