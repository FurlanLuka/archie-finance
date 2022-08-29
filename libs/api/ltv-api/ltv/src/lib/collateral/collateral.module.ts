import { Module } from '@nestjs/common';
import { CollateralQueueController } from './collateral.controller';
import { CollateralService } from './collateral.service';

@Module({
  controllers: [CollateralQueueController],
  providers: [CollateralService],
  exports: [CollateralService],
})
export class CollateralModule {}
