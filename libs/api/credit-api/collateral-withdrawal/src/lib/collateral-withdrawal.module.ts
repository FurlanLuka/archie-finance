import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CollateralWithdrawal } from './collateral-withdrawal.entity';
import { CollateralWithdrawalService } from './collateral-withdrawal.service';
import {
  CollateralWithdrawalController,
  CollateralWithdrawalQueueController,
} from './collateral-withdrawal.controller';
import {
  Collateral,
  CollateralValueModule,
} from '@archie/api/credit-api/collateral';

@Module({
  imports: [
    TypeOrmModule.forFeature([Collateral, CollateralWithdrawal]),
    CollateralValueModule,
  ],
  exports: [CollateralWithdrawalService],
  providers: [CollateralWithdrawalService],
  controllers: [
    CollateralWithdrawalController,
    CollateralWithdrawalQueueController,
  ],
})
export class CollateralWithdrawalModule {}
