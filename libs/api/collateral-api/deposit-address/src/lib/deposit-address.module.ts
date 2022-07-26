import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OmnibusVaultAccountModule } from '@archie/api/collateral-api/omnibus-vault-account';
import { UserVaultAccountModule } from '@archie/api/collateral-api/user-vault-account';
import { DepositAddressController } from './deposit-address.controller';
import { DepositAddress } from './deposit-address.entity';
import { DepositAddressService } from './deposit-address.service';

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
