import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@archie/api/utils/config';
import { ConfigVariables } from '@archie/api/collateral-api/constants';
import { CollateralWithdrawal } from './collateral-withdrawal.entity';
import { InternalApiModule } from '@archie/api/utils/internal';
import { CollateralWithdrawalService } from './collateral-withdrawal.service';
import {
  CollateralWithdrawalController,
  CollateralWithdrawalQueueController,
} from './collateral-withdrawal.controller';
import { Credit } from '@archie/api/credit-api/credit';
import { Collateral } from '@archie/api/credit-api/collateral';
import { LiquidationLog, MarginLtvModule } from '@archie/api/credit-api/margin';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Collateral,
      CollateralWithdrawal,
      Credit,
      LiquidationLog,
    ]),
    InternalApiModule.register({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        internalApiUrl: configService.get(ConfigVariables.INTERNAL_API_URL),
      }),
    }),
    MarginLtvModule,
  ],
  exports: [CollateralWithdrawalService],
  providers: [CollateralWithdrawalService],
  controllers: [
    CollateralWithdrawalController,
    CollateralWithdrawalQueueController,
  ],
})
export class CollateralWithdrawalModule {}
