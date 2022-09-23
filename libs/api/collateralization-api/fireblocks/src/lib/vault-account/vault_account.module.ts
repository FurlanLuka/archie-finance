import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VaultAccountService } from './vault_account.service';
import { VaultAccount } from './vault_account.entity';
import { FireblocksApiModule } from '../api/fireblocks_api.module';
import { DepositAddress } from './deposit_address.entity';
import { AssetsModule } from '../assets/assets.module';

@Module({
  imports: [
    FireblocksApiModule,
    TypeOrmModule.forFeature([VaultAccount, DepositAddress]),
    AssetsModule,
  ],
  providers: [VaultAccountService],
})
export class UserVaultAccountModule {}
