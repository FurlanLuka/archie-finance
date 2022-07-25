import { Module } from '@nestjs/common';
import { CollateralValueService } from './collateral_value.service';

@Module({
  imports: [],
  exports: [CollateralValueService],
  providers: [CollateralValueService],
  controllers: [],
})
export class CollateralValueModule {}
