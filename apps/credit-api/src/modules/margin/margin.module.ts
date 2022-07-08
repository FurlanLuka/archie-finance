import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Credit } from '../credit/credit.entity';
import { MarginQueueController } from './margin.controller';
import { MarginService } from './margin.service';
import { LiquidationLogs } from './liquidation_logs.entity';
import { MarginCalls } from './margin_calls.entity';
import { MarginNotifications } from './margin_notifications.entity';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { ConfigModule, ConfigService } from '@archie-microservices/config';
import {
  CHECK_MARGIN_EXCHANGE,
  ConfigVariables,
  MARGIN_CALL_COMPLETED_EXCHANGE,
  MARGIN_CALL_STARTED_EXCHANGE,
} from '@archie/api/credit-api/constants';

@Module({
  controllers: [MarginQueueController],
  imports: [
    TypeOrmModule.forFeature([
      Credit,
      LiquidationLogs,
      MarginCalls,
      MarginNotifications,
    ]),
    RabbitMQModule.forRootAsync(RabbitMQModule, {
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        exchanges: [
          CHECK_MARGIN_EXCHANGE,
          MARGIN_CALL_COMPLETED_EXCHANGE,
          MARGIN_CALL_STARTED_EXCHANGE,
        ],
        uri: configService.get(ConfigVariables.QUEUE_URL),
        connectionInitOptions: { wait: false },
      }),
    }),
  ],
  providers: [MarginService],
  exports: [MarginService],
})
export class MarginModule {}
