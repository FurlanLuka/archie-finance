import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  CollateralController,
  InternalCollateralController,
} from './collateral.controller';
import { Collateral } from './collateral.entity';
import { CollateralService } from './collateral.service';
import { CollateralDeposit } from './collateral_deposit.entity';
import { InternalApiModule } from '@archie-microservices/internal-api';
import { ConfigModule, ConfigService } from '@archie-microservices/config';
import { ConfigVariables } from '@archie/api/collateral-api/constants';
import { CollateralWithdrawal } from './collateral_withdrawal.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Collateral,
      CollateralDeposit,
      CollateralWithdrawal,
    ]),
    InternalApiModule.register({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        internalApiUrl: configService.get(ConfigVariables.INTERNAL_API_URL),
      }),
    }),
  ],
  exports: [CollateralService],
  providers: [CollateralService],
  controllers: [CollateralController, InternalCollateralController],
})
export class CollateralModule {}
