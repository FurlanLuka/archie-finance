import { Module } from '@nestjs/common';
import { Borrower } from '../borrower.entity';
import { PeachApiModule } from '../api/peach_api.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  AutopayController,
  AutopayDocumentsController,
} from './autopay.controller';
import { AutopayService } from './autopay.service';
import { BorrowerUtil } from '../utils/utils.module';

@Module({
  controllers: [AutopayController, AutopayDocumentsController],
  imports: [BorrowerUtil, TypeOrmModule.forFeature([Borrower]), PeachApiModule],
  providers: [AutopayService],
  exports: [AutopayService],
})
export class AutopayModule {}
