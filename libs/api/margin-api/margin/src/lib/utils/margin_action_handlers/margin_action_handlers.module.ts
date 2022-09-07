import { Module } from '@nestjs/common';
import { MarginCallInDangerHandlerService } from './margin_call_in_danger_handler.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MarginCallHandlerService } from './margin_call_handler.service';
import { LiquidationUtilService } from './liquidation.service';
import { MarginCallPriceFactory } from './margin_call_price.factory';
import { MarginCall } from '../../margin_calls.entity';
import { MarginCheck } from '../../margin_check.entity';
import { MarginNotification } from '../../margin_notifications.entity';

@Module({
  controllers: [],
  imports: [
    TypeOrmModule.forFeature([MarginNotification, MarginCall, MarginCheck]),
  ],
  providers: [
    MarginCallInDangerHandlerService,
    MarginCallHandlerService,
    LiquidationUtilService,
    MarginCallPriceFactory,
  ],
  exports: [MarginCallHandlerService, MarginCallInDangerHandlerService],
})
export class MarginActionHandlersModule {}
