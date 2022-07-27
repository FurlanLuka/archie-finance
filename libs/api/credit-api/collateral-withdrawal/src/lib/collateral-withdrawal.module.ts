import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@archie/api/utils/config';
import { ConfigVariables } from '@archie/api/collateral-api/constants';
import { CollateralWithdrawal } from './collateral-withdrawal.entity';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import {
  COLLATERAL_WITHDRAW_COMPLETED_EXCHANGE,
  COLLATERAL_WITHDRAW_INITIALIZED_EXCHANGE,
  COLLATERAL_WITHDRAW_TRANSACTION_CREATED_EXCHANGE,
} from '@archie/api/credit-api/constants';
import { InternalApiModule } from '@archie/api/utils/internal';
import { CollateralWithdrawalService } from './collateral-withdrawal.service';
import {
  CollateralWithdrawalController,
  CollateralWithdrawalQueueController,
} from './collateral-withdrawal.controller';
import { Credit } from '@archie/api/credit-api/credit';
import { Collateral } from '@archie/api/credit-api/collateral';
import { LiquidationLog, MarginLtvModule } from '@archie/api/credit-api/margin';
import { QueueModule, QueueService } from '@archie/api/utils/queue';

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
      imports: [ConfigModule, QueueModule],
      inject: [ConfigService, QueueService],
      useFactory: (
        configService: ConfigService,
        queueService: QueueService,
      ) => ({
        exchanges: queueService.createExchanges([
          COLLATERAL_WITHDRAW_INITIALIZED_EXCHANGE,
          COLLATERAL_WITHDRAW_TRANSACTION_CREATED_EXCHANGE,
          COLLATERAL_WITHDRAW_COMPLETED_EXCHANGE,
        ]),
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
