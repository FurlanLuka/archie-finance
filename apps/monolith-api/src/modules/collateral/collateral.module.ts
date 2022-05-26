import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CollateralController } from './collateral.controller';
import { Collateral } from './collateral.entity';
import { CollateralService } from './collateral.service';
import { CollateralDeposit } from './collateral_deposit.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Collateral, CollateralDeposit])],
  exports: [CollateralService],
  providers: [CollateralService],
  controllers: [CollateralController],
})
export class CollateralModule {}
