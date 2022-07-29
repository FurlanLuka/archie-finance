import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  CollateralController,
  CollateralQueueController,
} from './collateral.controller';
import { Collateral } from './collateral.entity';
import { CollateralService } from './collateral.service';
import { CollateralDeposit } from './collateral_deposit.entity';
import { CollateralValueModule } from './collateral-value/collateral-value.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Collateral, CollateralDeposit]),
    CollateralValueModule,
  ],
  exports: [CollateralService],
  providers: [CollateralService],
  controllers: [CollateralController, CollateralQueueController],
})
export class CollateralModule {}
