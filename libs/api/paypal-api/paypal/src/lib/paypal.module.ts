import { Module } from '@nestjs/common';
import { PaypalApiModule } from './api/paypal_api.module';
import { PaypalController } from './paypal.controller';
import { PaypalService } from './paypal.service';

@Module({
  controllers: [PaypalController],
  imports: [PaypalApiModule],
  providers: [PaypalService],
})
export class PaypalModule {}
