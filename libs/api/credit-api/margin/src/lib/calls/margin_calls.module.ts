import { Module } from '@nestjs/common';
import { MarginCallsService } from './margin_calls.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MarginNotification } from '@archie/api/credit-api/margin';
import { MarginCall } from '../margin_calls.entity';
import { ConfigModule, ConfigService } from '@archie/api/utils/config';
import {
  ConfigVariables,
  MARGIN_CALL_COMPLETED_EXCHANGE,
  MARGIN_CALL_STARTED_EXCHANGE,
} from '@archie/api/credit-api/constants';
import { MarginLiquidationModule } from './liquidation/margin_liquidation.module';
import { MarginLtvModule } from '../ltv/margin_ltv.module';
import {
  QueueModule,
  QueueService,
  RabbitMQCustomModule,
} from '@archie/api/utils/queue';

@Module({
  controllers: [],
  imports: [
    TypeOrmModule.forFeature([MarginNotification, MarginCall]),
    RabbitMQCustomModule.forRootAsync(RabbitMQCustomModule, {
      imports: [ConfigModule, QueueModule],
      inject: [ConfigService, QueueService],
      useFactory: (
        configService: ConfigService,
        queueService: QueueService,
      ) => ({
        exchanges: queueService.createExchanges([
          MARGIN_CALL_COMPLETED_EXCHANGE,
          MARGIN_CALL_COMPLETED_EXCHANGE,
          MARGIN_CALL_STARTED_EXCHANGE,
        ]),
        uri: configService.get(ConfigVariables.QUEUE_URL),
        connectionInitOptions: { wait: false },
      }),
    }),
    MarginLtvModule,
    MarginLiquidationModule,
  ],
  providers: [MarginCallsService],
  exports: [MarginCallsService],
})
export class MarginCallsModule {}
