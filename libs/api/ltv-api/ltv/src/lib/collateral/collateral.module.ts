import { Module } from '@nestjs/common';
import { CollateralQueueController } from './collateral.controller';
import { CollateralService } from './collateral.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LtvCollateral } from '../collateral.entity';
import { UtilsModule } from '../utils/utils.module';
import { CollateralTransaction } from '../collateral_transactions.entity';

@Module({
  controllers: [CollateralQueueController],
  imports: [
    TypeOrmModule.forFeature([LtvCollateral, CollateralTransaction]),
    UtilsModule,
  ],
  providers: [CollateralService],
  exports: [CollateralService],
})
export class CollateralModule {}
