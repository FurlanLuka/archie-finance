import { Module } from '@nestjs/common';
import { CollateralModule } from './collateral/collateral.module';
import { CreditModule } from './credit/credit.module';
import { LtvModule } from './ltv/ltv.module';

@Module({
  imports: [CollateralModule, CreditModule, LtvModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class LibModule {}
