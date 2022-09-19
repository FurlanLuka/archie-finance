import { Module } from '@nestjs/common';
import { LtvUtilService } from './ltv.service';
import { CollateralValueUtilService } from './collateral_value.service';
import { CreditAssetUtilService } from './credit_asset.service';
import { LtvUpdatedUtilService } from './ltv_updated.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LtvCollateral } from '../collateral.entity';
import { LtvCredit } from '../credit.entity';
import { DatabaseErrorHandlingService } from './database_error_handling.service';

@Module({
  controllers: [],
  imports: [TypeOrmModule.forFeature([LtvCollateral, LtvCredit])],
  providers: [
    LtvUtilService,
    CollateralValueUtilService,
    CreditAssetUtilService,
    LtvUpdatedUtilService,
    DatabaseErrorHandlingService,
  ],
  exports: [
    LtvUtilService,
    CollateralValueUtilService,
    CreditAssetUtilService,
    LtvUpdatedUtilService,
    DatabaseErrorHandlingService,
  ],
})
export class UtilsModule {}
