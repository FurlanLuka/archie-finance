import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  MarginController,
  MarginInternalController,
  MarginQueueController,
} from './margin.controller';
import { MarginService } from './margin.service';
import { LiquidationLog } from './liquidation_logs.entity';
import { MarginCall } from './margin_calls.entity';
import { MarginLtvModule } from './ltv/margin_ltv.module';
import { MarginCallsModule } from './calls/margin_calls.module';
import { MarginCollateralValueCheckModule } from './collateral_value_checks/margin_collateral_value_cheks.module';
import { CreditLimitModule } from './credit_limit/credit_limit.module';
import { Credit } from '@archie/api/credit-api/credit';
import { Collateral } from '@archie/api/credit-api/collateral';

@Module({
  controllers: [
    MarginQueueController,
    MarginInternalController,
    MarginController,
  ],
  imports: [
    TypeOrmModule.forFeature([Credit, LiquidationLog, MarginCall, Collateral]),
    MarginLtvModule,
    MarginCallsModule,
    MarginCollateralValueCheckModule,
    CreditLimitModule,
  ],
  providers: [MarginService],
  exports: [MarginService],
})
export class MarginModule {}
