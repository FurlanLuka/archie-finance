import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LedgerController } from './ledger.controller';
import { LedgerAccount } from './ledger_account.entity';
import { LedgerService } from './ledger.service';
import { LedgerLog } from './ledger_log.entity';
import { AssetsModule } from '@archie/api/ledger-api/assets';

@Module({
  imports: [TypeOrmModule.forFeature([LedgerLog, LedgerAccount]), AssetsModule],
  providers: [LedgerService],
  controllers: [LedgerController],
  exports: [LedgerService],
})
export class LedgerModule {}
