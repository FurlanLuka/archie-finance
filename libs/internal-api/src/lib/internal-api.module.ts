import { DynamicModule, Module } from '@nestjs/common';
import { InternalApiOptions } from './internal-api.interfaces';
import { InternalApiService } from './internal-api.service';

@Module({})
export class InternalApiModule {
  static register(options: InternalApiOptions): DynamicModule {
    return {
      module: InternalApiModule,
      imports: [...options.imports],
      providers: [
        {
          inject: options.inject,
          provide: 'INTERNAL_API_CONFIG',
          useFactory: options.useFactory,
        },
        InternalApiService,
      ],
      exports: [InternalApiService],
    };
  }
}
