import { Module } from '@nestjs/common';
import { LedgerModule } from '../ledger/ledger.module';
import { DepositQueueController } from './deposit.controller';

@Module({
  imports: [LedgerModule],
  controllers: [DepositQueueController],
})
export class DepositModule {}
