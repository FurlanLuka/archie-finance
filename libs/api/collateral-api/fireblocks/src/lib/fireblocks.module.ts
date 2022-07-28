import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { FireblocksService } from './fireblocks.service';
import { CryptoModule } from '@archie/api/utils/crypto';
import { ConfigModule, ConfigService } from '@archie/api/utils/config';
import {
  COLLATERAL_WITHDRAW_INITIALIZED_EXCHANGE,
  COLLATERAL_WITHDRAW_TRANSACTION_CREATED_EXCHANGE,
  MARGIN_CALL_COMPLETED_EXCHANGE,
} from '@archie/api/credit-api/constants';
import { ConfigVariables } from '@archie/api/collateral-api/constants';
import {
  QueueModule,
  QueueService,
  RabbitMQCustomModule,
} from '@archie/api/utils/queue';

@Module({
  imports: [
    PassportModule,
    CryptoModule.register(),
    RabbitMQCustomModule.forRootAsync(RabbitMQCustomModule, {
      imports: [ConfigModule, QueueModule],
      inject: [ConfigService, QueueService],
      useFactory: (
        configService: ConfigService,
        queueService: QueueService,
      ) => ({
        exchanges: queueService.createExchanges([
          COLLATERAL_WITHDRAW_INITIALIZED_EXCHANGE,
          COLLATERAL_WITHDRAW_TRANSACTION_CREATED_EXCHANGE,
          MARGIN_CALL_COMPLETED_EXCHANGE,
        ]),
        uri: configService.get(ConfigVariables.QUEUE_URL),
        connectionInitOptions: { wait: false },
        enableControllerDiscovery: true,
        connectionManagerOptions: {
          heartbeatIntervalInSeconds: 10,
        },
      }),
    }),
  ],
  providers: [FireblocksService],
  exports: [FireblocksService],
  controllers: [],
})
export class FireblocksModule {}
