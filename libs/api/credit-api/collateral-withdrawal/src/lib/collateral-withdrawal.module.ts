import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CollateralWithdrawal } from './collateral-withdrawal.entity';
import { CollateralWithdrawalService } from './collateral-withdrawal.service';
import {
  CollateralWithdrawalController,
  CollateralWithdrawalQueueController,
} from './collateral-withdrawal.controller';
import { Credit } from '@archie/api/credit-api/credit';
import {
  Collateral,
  CollateralValueModule,
} from '@archie/api/credit-api/collateral';
import { LiquidationLog, MarginLtvModule } from '@archie/api/credit-api/margin';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Collateral,
      CollateralWithdrawal,
      Credit,
      LiquidationLog,
    ]),
    CollateralValueModule,
    MarginLtvModule,
  ],
  exports: [CollateralWithdrawalService],
  providers: [CollateralWithdrawalService],
  controllers: [
    CollateralWithdrawalController,
    CollateralWithdrawalQueueController,
  ],
})
export class CollateralWithdrawalModule {}
