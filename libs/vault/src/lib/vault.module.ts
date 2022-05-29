import { DynamicModule, Module } from '@nestjs/common';
import { VaultOptions } from './vault.interfaces';
import { VaultService } from './vault.service';

@Module({
  providers: [VaultService],
  exports: [VaultService],
})
export class VaultModule {
  static register(options: VaultOptions): DynamicModule {
    return {
      module: VaultModule,
      imports: [...options.imports],
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
