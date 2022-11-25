import { Module } from '@nestjs/common';
import { MarginCallInDangerHandlerService } from './margin_call_in_danger_handler.service';
import { MarginCallHandlerService } from './margin_call_handler.service';
import { MarginCallPriceFactory } from './margin_call_price.factory';
import { MarginEntitiesModule } from '../../entities/margin_entities.module';
import { LiquidationModule } from '../../../liquidation/liquidation.module';

@Module({
  controllers: [],
  imports: [MarginEntitiesModule, LiquidationModule],
  providers: [
    MarginCallInDangerHandlerService,
    MarginCallHandlerService,
    MarginCallPriceFactory,
  ],
  exports: [MarginCallHandlerService, MarginCallInDangerHandlerService],
})
export class MarginActionHandlersModule {}
