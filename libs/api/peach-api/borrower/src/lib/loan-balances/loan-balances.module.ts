import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Borrower } from '../borrower.entity';
import { PeachApiModule } from '../api/peach_api.module';
import { BorrowerUtil } from '../utils/utils.module';
import {
  LoanBalancesController,
  LoanBalancesQueueController,
} from './loan-balances.controller';
import { LoanBalancesService } from './loan-balances.service';

@Module({
  controllers: [LoanBalancesController, LoanBalancesQueueController],
  imports: [TypeOrmModule.forFeature([Borrower]), PeachApiModule, BorrowerUtil],
  providers: [LoanBalancesService],
  exports: [LoanBalancesService],
})
export class LoanBalancesModule {}
