import { Module } from '@nestjs/common';
import { LtvUtilService } from './ltv.service';
import { CollateralValueUtilService } from './collateral_value.service';
import { CreditAssetUtilService } from './credit_asset.service';
import { LtvUpdatedUtilService } from './ltv_updated.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LtvCollateral } from '../collateral.entity';
import { LtvCredit } from '../credit.entity';

@Module({
  controllers: [],
  imports: [TypeOrmModule.forFeature([LtvCollateral, LtvCredit])],
  providers: [
    LtvUtilService,
    CollateralValueUtilService,
    CreditAssetUtilService,
    LtvUpdatedUtilService,
  ],
  exports: [
    LtvUtilService,
    CollateralValueUtilService,
    CreditAssetUtilService,
    LtvUpdatedUtilService,
  ],
})
export class UtilsModule {}
