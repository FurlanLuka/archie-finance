import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaypalApiModule } from './api/paypal_api.module';
import { Order } from './order.entity';
import { PaypalController } from './paypal.controller';
import { PaypalService } from './paypal.service';

@Module({
  controllers: [PaypalController],
  imports: [TypeOrmModule.forFeature([Order]), PaypalApiModule],
  providers: [PaypalService],
})
export class PaypalModule {}
