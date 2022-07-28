import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@archie/api/utils/config';
import {
  ConfigVariables,
  CREDIT_LIMIT_DECREASED,
  CREDIT_LIMIT_INCREASED,
} from '@archie/api/credit-api/constants';
import { Credit, CreditModule } from '@archie/api/credit-api/credit';
import { CreditLimitService } from './credit_limit.service';
import {
  QueueModule,
  QueueService,
  RabbitMQCustomModule,
} from '@archie/api/utils/queue';

@Module({
  controllers: [],
  imports: [
    TypeOrmModule.forFeature([Credit]),
    RabbitMQCustomModule.forRootAsync(RabbitMQCustomModule, {
      imports: [ConfigModule, QueueModule],
      inject: [ConfigService, QueueService],
      useFactory: (
        configService: ConfigService,
        queueService: QueueService,
      ) => ({
        exchanges: queueService.createExchanges([
          CREDIT_LIMIT_DECREASED,
          CREDIT_LIMIT_INCREASED,
        ]),
        uri: configService.get(ConfigVariables.QUEUE_URL),
        connectionInitOptions: { wait: false },
      }),
    }),
    CreditModule,
  ],
  providers: [CreditLimitService],
  exports: [CreditLimitService],
})
export class CreditLimitModule {}
