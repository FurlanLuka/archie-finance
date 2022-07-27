import { Module } from '@nestjs/common';
import { MarginLtvService } from './margin_ltv.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MarginNotification } from '../margin_notifications.entity';
import { ConfigModule, ConfigService } from '@archie/api/utils/config';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import {
  ConfigVariables,
  LTV_LIMIT_APPROACHING_EXCHANGE,
} from '@archie/api/credit-api/constants';
import { CollateralValueModule } from '@archie/api/credit-api/collateral';
import { QueueModule, QueueService } from '@archie/api/utils/queue';

@Module({
  controllers: [],
  imports: [
    TypeOrmModule.forFeature([MarginNotification]),
    RabbitMQModule.forRootAsync(RabbitMQModule, {
      imports: [ConfigModule, QueueModule],
      inject: [ConfigService, QueueService],
      useFactory: (
        configService: ConfigService,
        queueService: QueueService,
      ) => ({
        exchanges: queueService.createExchanges([
          LTV_LIMIT_APPROACHING_EXCHANGE,
        ]),
        uri: configService.get(ConfigVariables.QUEUE_URL),
        connectionInitOptions: { wait: false },
      }),
    }),
    CollateralValueModule,
  ],
  providers: [MarginLtvService],
  exports: [MarginLtvService],
})
export class MarginLtvModule {}
