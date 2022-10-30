import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  InternalLedgerController,
  LedgerController,
  LedgerQueueController,
} from './ledger.controller';
import { LedgerAccount } from './ledger_account.entity';
import { LedgerService } from './ledger.service';
import { LedgerLog } from './ledger_log.entity';
import { AssetsModule } from '@archie/api/ledger-api/assets';
import { LedgerUser } from './ledger_user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([LedgerLog, LedgerAccount, LedgerUser]),
    AssetsModule,
  ],
  providers: [LedgerService],
  controllers: [
    LedgerController,
    LedgerQueueController,
    InternalLedgerController,
  ],
  exports: [LedgerService],
})
export class LedgerModule {}
