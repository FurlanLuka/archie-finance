import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Credit } from '../credit/credit.entity';
import { MarginController } from './margin.controller';
import { MarginService } from './margin.service';
import { LiquidationLogs } from './liquidation_logs.entity';
import { MarginCalls } from './margin_calls.entity';
import { MarginNotifications } from './margin_notifications.entity';

@Module({
  controllers: [MarginController],
  imports: [
    TypeOrmModule.forFeature([
      Credit,
      LiquidationLogs,
      MarginCalls,
      MarginNotifications,
    ]),
  ],
  providers: [MarginService],
  exports: [MarginService],
})
export class MarginModule {}
