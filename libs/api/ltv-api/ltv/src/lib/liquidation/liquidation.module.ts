import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Liquidation } from './liquidation.entity';
import { LiquidationService } from './liquidation.service';

@Module({
  imports: [TypeOrmModule.forFeature([Liquidation])],
  controllers: [],
  providers: [LiquidationService],
  exports: [LiquidationService],
})
export class LiquidationModule {}
