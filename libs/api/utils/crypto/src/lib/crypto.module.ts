import { DynamicModule, Module } from '@nestjs/common';
import { CryptoOptions } from './crypto.interfaces';
import { CryptoService } from './crypto.service';

@Module({})
export class CryptoModule {
  static register(options?: CryptoOptions): DynamicModule {
    const provider = options
      ? {
          inject: options.inject,
          provide: 'CRYPTO_OPTIONS',
          useFactory: options.useFactory,
        }
      : {
          provide: 'CRYPTO_OPTIONS',
          useValue: {},
        };

    return {
      module: CryptoModule,
      imports: options ? options.imports : [],
      providers: [provider, CryptoService],
      exports: [CryptoService],
      global: true,
    };
  }
}
