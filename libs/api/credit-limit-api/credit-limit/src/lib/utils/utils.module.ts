import { Module } from '@nestjs/common';
import { MathUtilService } from './math.service';
import { CollateralValueUtilService } from './collateral_value.service';
import { CreditLimitAdjustmentService } from './credit_limit_adjustment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Collateral } from '../collateral.entity';
import { CreditLimit } from '../credit_limit.entity';
import { CollateralBalanceUpdateUtilService } from './collateral_balance_update.service';
import { DatabaseErrorHandlingService } from './database_error_handling.service';

@Module({
  controllers: [],
  imports: [TypeOrmModule.forFeature([Collateral, CreditLimit])],
  providers: [
    MathUtilService,
    CollateralValueUtilService,
    CollateralBalanceUpdateUtilService,
    CreditLimitAdjustmentService,
    DatabaseErrorHandlingService,
  ],
  exports: [
    MathUtilService,
    CollateralValueUtilService,
    CollateralBalanceUpdateUtilService,
    CreditLimitAdjustmentService,
    DatabaseErrorHandlingService,
  ],
})
export class UtilsModule {}
