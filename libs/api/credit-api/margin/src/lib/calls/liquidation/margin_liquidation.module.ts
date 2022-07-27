import { Module } from '@nestjs/common';
import { MarginLiquidationService } from './margin_liquidation.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LiquidationLog } from '../../liquidation_logs.entity';
import { Collateral } from '@archie/api/credit-api/collateral';

@Module({
  controllers: [],
  imports: [TypeOrmModule.forFeature([LiquidationLog, Collateral])],
  providers: [MarginLiquidationService],
  exports: [MarginLiquidationService],
})
export class MarginLiquidationModule {}
