import { Module } from '@nestjs/common';
import { PaymentsResponseFactory } from './payments_response.factory';

@Module({
  controllers: [],
  imports: [],
  providers: [PaymentsResponseFactory],
  exports: [PaymentsResponseFactory],
})
export class PaymentsUtilModule {}
