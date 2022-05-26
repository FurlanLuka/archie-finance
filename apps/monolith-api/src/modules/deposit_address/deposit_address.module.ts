import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OmnibusVaultAccountModule } from '../omnibus_vault_account/omnibus_vault_account.module';
import { UserVaultAccountModule } from '../user_vault_account/user_vault_account.module';
import { DepositAddressController } from './deposit_address.controller';
import { DepositAddress } from './deposit_address.entity';
import { DepositAddressService } from './deposit_address.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([DepositAddress]),
    UserVaultAccountModule,
    OmnibusVaultAccountModule,
  ],
  providers: [DepositAddressService],
  exports: [DepositAddressService],
  controllers: [DepositAddressController],
})
export class DepositAddressModule {}
