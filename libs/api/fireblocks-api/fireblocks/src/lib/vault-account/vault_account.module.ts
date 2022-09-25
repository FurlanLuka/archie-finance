import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VaultAccountService } from './vault_account.service';
import { VaultAccount } from './vault_account.entity';
import { FireblocksApiModule } from '../api/fireblocks_api.module';
import { DepositAddress } from './deposit_address.entity';
import { AssetsModule } from '@archie/api/fireblocks-api/assets';

@Module({
  imports: [
    FireblocksApiModule,
    TypeOrmModule.forFeature([VaultAccount, DepositAddress]),
    AssetsModule,
  ],
  providers: [VaultAccountService],
  exports: [VaultAccountService],
})
export class VaultAccountModule {}
