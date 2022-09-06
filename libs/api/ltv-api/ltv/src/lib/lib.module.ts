import { Module } from '@nestjs/common';
import { CollateralModule } from './collateral/collateral.module';
import { CreditModule } from './credit/credit.module';
import { LtvModule } from './ltv/ltv.module';
import { PeriodicCheckModule } from './periodic_check/periodic_check.module';

@Module({
  imports: [CollateralModule, CreditModule, LtvModule, PeriodicCheckModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class LibModule {}
