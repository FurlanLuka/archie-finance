import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LedgerService } from './ledger.service';
import { LedgerAccount } from './ledger_account.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LedgerAccount])],
  providers: [LedgerService],
  exports: [LedgerService],
})
export class LedgerModule {}
