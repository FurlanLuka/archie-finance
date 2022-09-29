import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssetsModule } from '@archie/api/ledger-api/assets';
import { LedgerModule } from '../ledger/ledger.module';
import { WithdrawController } from './withdraw.controller';
import { WithdrawService } from './withdraw.service';
import { Withdrawal } from './withdrawal.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Withdrawal]), LedgerModule, AssetsModule],
  controllers: [WithdrawController],
  providers: [WithdrawService],
})
export class WithdrawModule {}
