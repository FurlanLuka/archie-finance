import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Borrower } from '../borrower.entity';
import { PeachApiModule } from '../api/peach_api.module';
import { PeachPaymentInstrumentsService } from './payment_instrument.service';
import { PeachPaymentInstrumentsController } from './payment_instrument.controller';
import { BorrowerUtil } from '../utils/utils.module';

@Module({
  controllers: [PeachPaymentInstrumentsController],
  imports: [TypeOrmModule.forFeature([Borrower]), PeachApiModule, BorrowerUtil],
  providers: [PeachPaymentInstrumentsService],
  exports: [PeachPaymentInstrumentsService],
})
export class PaymentInstrumentModule {}
