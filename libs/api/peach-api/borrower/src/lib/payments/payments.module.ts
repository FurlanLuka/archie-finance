import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Borrower } from '../borrower.entity';
import { PeachApiModule } from '../api/peach_api.module';
import { PaymentsService } from './payments.service';
import {
  PaymentsController,
  PaymentsQueueController,
} from './payments.controller';
import { PaymentsUtilModule } from './utils/payments_utils.module';

@Module({
  controllers: [PaymentsController, PaymentsQueueController],
  imports: [
    TypeOrmModule.forFeature([Borrower]),
    PeachApiModule,
    PaymentsUtilModule,
  ],
  providers: [PaymentsService],
  exports: [PaymentsService],
})
export class PaymentsModule {}
