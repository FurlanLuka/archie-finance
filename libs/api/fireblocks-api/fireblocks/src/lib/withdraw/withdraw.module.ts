import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssetsModule } from '@archie/api/fireblocks-api/assets';
import { VaultAccountModule } from '../vault-account/vault_account.module';
import { Withdraw } from './withdraw.entity';
import { WithdrawService } from './withdraw.service';
import { WithdrawQueueController } from './withdraw.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Withdraw]),
    AssetsModule,
    VaultAccountModule,
  ],
  providers: [WithdrawService],
  controllers: [WithdrawQueueController],
})
export class WithdrawModule {}
