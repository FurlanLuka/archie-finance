import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Credit } from '../credit/credit.entity';
import { MarginQueueController } from './margin.controller';
import { MarginService } from './margin.service';
import { LiquidationLog } from './liquidation_logs.entity';
import { MarginCall } from './margin_calls.entity';
import { MarginLtvModule } from './ltv/margin_ltv.module';
import { MarginCallsModule } from './calls/margin_calls.module';
import { Collateral } from '../collateral/collateral.entity';

@Module({
  controllers: [MarginQueueController],
  imports: [
    TypeOrmModule.forFeature([Credit, LiquidationLog, MarginCall, Collateral]),
    MarginLtvModule,
    MarginCallsModule,
  ],
  providers: [MarginService],
  exports: [MarginService],
})
export class MarginModule {}
