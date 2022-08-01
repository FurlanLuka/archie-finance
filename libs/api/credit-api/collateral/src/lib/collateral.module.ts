import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  CollateralController,
  CollateralQueueController,
  InternalCollateralController,
} from './collateral.controller';
import { Collateral } from './collateral.entity';
import { CollateralService } from './collateral.service';
import { CollateralDeposit } from './collateral_deposit.entity';
import { InternalApiModule } from '@archie/api/utils/internal';
import { ConfigModule, ConfigService } from '@archie/api/utils/config';
import { ConfigVariables } from '@archie/api/collateral-api/constants';
import { CollateralValueModule } from './collateral-value/collateral-value.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Collateral, CollateralDeposit]),
    InternalApiModule.register({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        internalApiUrl: configService.get(ConfigVariables.INTERNAL_API_URL),
      }),
    }),
    CollateralValueModule,
  ],
  exports: [CollateralService],
  providers: [CollateralService],
  controllers: [
    CollateralController,
    InternalCollateralController,
    CollateralQueueController,
  ],
})
export class CollateralModule {}
