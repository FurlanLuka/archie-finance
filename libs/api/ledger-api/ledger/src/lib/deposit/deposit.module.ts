import { Module } from '@nestjs/common';
import { AssetsModule } from '@archie/api/ledger-api/assets';
import { LedgerModule } from '../ledger/ledger.module';
import { DepositQueueController } from './deposit.controller';
import { DepositService } from './deposit.service';

@Module({
  imports: [LedgerModule, AssetsModule],
  controllers: [DepositQueueController],
  providers: [DepositService],
})
export class DepositModule {}
