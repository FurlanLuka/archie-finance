import { Module } from '@nestjs/common';
import { MarginCollateralValueCheckService } from './margin_collaterall_value_checks.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MarginCollateralCheck } from '../margin_collateral_check.entity';

@Module({
  controllers: [],
  imports: [TypeOrmModule.forFeature([MarginCollateralCheck])],
  providers: [MarginCollateralValueCheckService],
  exports: [MarginCollateralValueCheckService],
})
export class MarginCollateralValueCheckModule {}
