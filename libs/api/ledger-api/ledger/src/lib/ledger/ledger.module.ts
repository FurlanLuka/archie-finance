import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LedgerController } from './ledger.controller';
import { LedgerAccount } from './ledger_account.entity';
import { LedgerService } from './ledger.service';
import { LedgerLog } from './ledger_log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LedgerLog, LedgerAccount])],
  providers: [LedgerService],
  controllers: [LedgerController],
})
export class LedgerModule {}
