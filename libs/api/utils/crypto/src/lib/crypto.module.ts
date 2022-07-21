import { DynamicModule, Module } from '@nestjs/common';
import { CryptoOptions } from './crypto.interfaces';
import { CryptoService } from './crypto.service';

@Module({})
export class CryptoModule {
  static register(options: CryptoOptions): DynamicModule {
    return {
      module: CryptoModule,
      imports: [...options.imports],
      providers: [
        {
          inject: options.inject,
          provide: 'CRYPTO_OPTIONS',
          useFactory: options.useFactory,
        },
        CryptoService,
      ],
      exports: [CryptoService],
      global: true,
    };
  }
}
