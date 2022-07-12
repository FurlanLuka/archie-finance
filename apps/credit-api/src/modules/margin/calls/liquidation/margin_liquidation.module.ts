import { Module } from '@nestjs/common';
import { MarginLiquidationService } from './margin_liquidation.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LiquidationLog } from '../../liquidation_logs.entity';

@Module({
  controllers: [],
  imports: [TypeOrmModule.forFeature([LiquidationLog])],
  providers: [MarginLiquidationService],
  exports: [MarginLiquidationService],
})
export class MarginLiquidationModule {}
