import { Module } from '@nestjs/common';
import { MarginCallsService } from './margin_calls.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MarginCall } from '../margin_calls.entity';
import { MarginLiquidationModule } from './liquidation/margin_liquidation.module';
import { MarginLtvModule } from '../ltv/margin_ltv.module';
import { MarginNotification } from '../margin_notifications.entity';

@Module({
  controllers: [],
  imports: [
    TypeOrmModule.forFeature([MarginNotification, MarginCall]),
    MarginLtvModule,
    MarginLiquidationModule,
  ],
  providers: [MarginCallsService],
  exports: [MarginCallsService],
})
export class MarginCallsModule {}
