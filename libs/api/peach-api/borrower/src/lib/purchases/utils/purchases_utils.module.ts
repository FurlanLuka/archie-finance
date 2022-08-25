import { Module } from '@nestjs/common';
import { PurchasesResponseFactory } from './purchases_response.factory';

@Module({
  controllers: [],
  imports: [],
  providers: [PurchasesResponseFactory],
  exports: [PurchasesResponseFactory],
})
export class PaymentsUtilModule {}
