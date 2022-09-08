import { Module } from '@nestjs/common';
import { PaypalApiService } from './paypal_api.service';

@Module({
  providers: [PaypalApiService],
  exports: [PaypalApiService],
})
export class PaypalApiModule {}
