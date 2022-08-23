import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Borrower } from '../borrower.entity';
import { PeachApiModule } from '../api/peach_api.module';
import { PurchasesService } from './purchases.service';
import { PurchasesController } from './purchases.controller';
import { BorrowerUtil } from '../utils/utils.module';
import { PaymentsUtilModule } from './utils/purchases_utils.module';

@Module({
  controllers: [PurchasesController],
  imports: [
    TypeOrmModule.forFeature([Borrower]),
    PeachApiModule,
    BorrowerUtil,
    PaymentsUtilModule,
  ],
  providers: [PurchasesService],
  exports: [PurchasesService],
})
export class PurchasesModule {}
