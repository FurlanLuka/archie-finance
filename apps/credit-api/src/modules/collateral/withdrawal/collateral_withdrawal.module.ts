import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@archie-microservices/config';
import { ConfigVariables } from '@archie/api/collateral-api/constants';
import { CollateralWithdrawal } from './collateral_withdrawal.entity';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import {
  COLLATERAL_WITHDRAW_COMPLETED_EXCHANGE,
  COLLATERAL_WITHDRAW_INITIALIZED_EXCHANGE,
  COLLATERAL_WITHDRAW_TRANSACTION_CREATED_EXCHANGE,
} from '@archie/api/credit-api/constants';
import { InternalApiModule } from '@archie-microservices/internal-api';
import { Collateral } from '../collateral.entity';
import { CollateralWithdrawalService } from './collateral_withdrawal.service';
import {
  CollateralWithdrawalController,
  CollateralWithdrawalQueueController,
} from './collateral_withdrawal.controller';
import { Credit } from '../../credit/credit.entity';
import { LiquidationLog } from '../../margin/liquidation_logs.entity';
import { MarginLtvModule } from '../../margin/ltv/margin_ltv.module';

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
    RabbitMQModule.forRootAsync(RabbitMQModule, {
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        exchanges: [
          COLLATERAL_WITHDRAW_INITIALIZED_EXCHANGE,
          COLLATERAL_WITHDRAW_TRANSACTION_CREATED_EXCHANGE,
          COLLATERAL_WITHDRAW_COMPLETED_EXCHANGE,
        ],
        uri: configService.get(ConfigVariables.QUEUE_URL),
        connectionInitOptions: { wait: false },
        enableControllerDiscovery: true,
        connectionManagerOptions: {
          heartbeatIntervalInSeconds: 10,
        },
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