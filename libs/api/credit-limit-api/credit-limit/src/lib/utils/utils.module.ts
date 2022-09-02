import { Module } from '@nestjs/common';
import { MathUtilService } from './math.service';
import { CollateralValueUtilService } from './collateral_value.service';

@Module({
  controllers: [],
  providers: [MathUtilService, CollateralValueUtilService],
  exports: [MathUtilService, CollateralValueUtilService],
})
export class UtilsModule {}
