import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  CreditController,
  InternalCreditController,
} from './credit.controller';
import { Credit } from './credit.entity';
import { CreditService } from './credit.service';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import {
  ConfigVariables,
  COLLATERAL_RECEIVED_EXCHANGE,
} from '@archie/api/credit-api/constants';
import { ConfigService, ConfigModule } from '@archie/api/utils/config';
import { QueueModule, QueueService } from '@archie/api/utils/queue';

@Module({
  controllers: [CreditController, InternalCreditController],
  imports: [
    TypeOrmModule.forFeature([Credit]),
    RabbitMQModule.forRootAsync(RabbitMQModule, {
      imports: [ConfigModule, QueueModule],
      inject: [ConfigService, QueueService],
      useFactory: (
        configService: ConfigService,
        queueService: QueueService,
      ) => ({
        exchanges: queueService.createExchanges([COLLATERAL_RECEIVED_EXCHANGE]),
        uri: configService.get(ConfigVariables.QUEUE_URL),
        connectionInitOptions: { wait: false },
      }),
    }),
  ],
  providers: [CreditService],
  exports: [CreditService],
})
export class CreditModule {}
