import { Module } from '@nestjs/common';
import { Borrower } from '../borrower.entity';
import { PeachApiModule } from '../api/peach_api.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  AutopayController,
  AutopayDocumentsController,
} from './autopay.controller';
import { AutopayService } from './autopay.service';

@Module({
  controllers: [AutopayController, AutopayDocumentsController],
  imports: [TypeOrmModule.forFeature([Borrower]), PeachApiModule],
  providers: [AutopayService],
  exports: [AutopayService],
})
export class AutopayModule {}
