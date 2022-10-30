import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssetsModule } from '@archie/api/fireblocks-api/assets';
import { VaultAccountModule } from '../vault-account/vault_account.module';
import { DepositQueueController } from './deposit.controller';
import { Deposit } from './deposit.entity';
import { DepositService } from './deposit.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Deposit]),
    VaultAccountModule,
    AssetsModule,
  ],
  controllers: [DepositQueueController],
  providers: [DepositService],
})
export class DepositModule {}
