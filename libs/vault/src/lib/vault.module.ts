import { DynamicModule, Module } from '@nestjs/common';
import { VaultOptions } from './vault.interfaces';
import { VaultService } from './vault.service';
import { CryptoModule } from '@archie/api/utils/crypto';

@Module({})
export class VaultModule {
  static register(options: VaultOptions): DynamicModule {
    return {
      module: VaultModule,
      imports: [...options.imports, CryptoModule],
      providers: [
        {
          inject: options.inject,
          provide: 'VAULT_CONFIG',
          useFactory: options.useFactory,
        },
        VaultService,
      ],
      exports: [VaultService],
      global: true,
    };
  }
}
