import { Module } from '@nestjs/common';
import { LtvService } from './ltv.service';
import { LtvController } from './ltv.controller';
import { CollateralModule } from './collateral/collateral.module';

@Module({
  imports: [CollateralModule],
  controllers: [LtvController],
  providers: [LtvService],
  exports: [LtvService],
})
export class LtvModule {}
