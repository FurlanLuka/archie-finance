import { Module } from '@nestjs/common';
import { MathUtilService } from './math.service';
import { CollateralValueUtilService } from './collateral_value.service';
import { CreditLimitAdjustmentService } from './credit_limit_adjustment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Collateral } from '../collateral.entity';
import { CreditLimit } from '../credit_limit.entity';
import { CollateralBalanceUpdateUtilService } from './collateral_balance_update.service';

@Module({
  controllers: [],
  imports: [TypeOrmModule.forFeature([Collateral, CreditLimit])],
  providers: [
    MathUtilService,
    CollateralValueUtilService,
    CollateralBalanceUpdateUtilService,
    CreditLimitAdjustmentService,
  ],
  exports: [
    MathUtilService,
    CollateralValueUtilService,
    CollateralBalanceUpdateUtilService,
    CreditLimitAdjustmentService,
  ],
})
export class UtilsModule {}
