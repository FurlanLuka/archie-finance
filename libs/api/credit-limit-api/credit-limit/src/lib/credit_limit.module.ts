import { Module } from '@nestjs/common';
import { CreditLimitService } from './credit_limit.service';
import {
  CreditLimitController,
  CreditLimitQueueController,
} from './credit_limit.controller';
import { UtilsModule } from './utils/utils.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Collateral } from './collateral.entity';
import { CreditLimit } from './credit_limit.entity';
import { PeriodicCheckModule } from './periodic_check/periodic_check.module';
import { CollateralTransaction } from './collateral_transactions.entity';

@Module({
  imports: [
    UtilsModule,
    TypeOrmModule.forFeature([Collateral, CreditLimit, CollateralTransaction]),
    PeriodicCheckModule,
  ],
  controllers: [CreditLimitController, CreditLimitQueueController],
  providers: [CreditLimitService],
  exports: [CreditLimitService],
})
export class CreditLimitModule {}
