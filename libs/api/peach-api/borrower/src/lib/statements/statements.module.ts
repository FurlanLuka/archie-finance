import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Borrower } from '../borrower.entity';
import { PeachApiModule } from '../api/peach_api.module';
import { BorrowerUtil } from '../utils/utils.module';
import { LoanStatementsController } from './statements.controller';
import { LoanStatementsService } from './statements.service';

@Module({
  controllers: [LoanStatementsController],
  imports: [TypeOrmModule.forFeature([Borrower]), PeachApiModule, BorrowerUtil],
  providers: [LoanStatementsService],
  exports: [LoanStatementsService],
})
export class LoanStatementsModule {}
