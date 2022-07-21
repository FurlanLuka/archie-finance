import { Module } from '@nestjs/common';
import { RizeController, RizeQueueController } from './rize.controller';
import { RizeService } from './rize.service';
import { RizeApiModule } from './api/rize_api.module';
import { RizeFactoryModule } from './factory/rize_factory.module';
import { RizeValidatorModule } from './validator/rize_validator.module';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { ConfigModule, ConfigService } from '@archie/api/utils/config';
import {
  CARD_ACTIVATED_EXCHANGE,
  ConfigVariables,
} from '@archie/api/credit-api/constants';
import { CreditModule } from '../credit/credit.module';

@Module({
  controllers: [RizeController, RizeQueueController],
  providers: [RizeService],
  imports: [
    RabbitMQModule.forRootAsync(RabbitMQModule, {
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        exchanges: [CARD_ACTIVATED_EXCHANGE],
        uri: configService.get(ConfigVariables.QUEUE_URL),
        connectionInitOptions: { wait: false },
      }),
    }),
    RizeApiModule,
    RizeFactoryModule,
    RizeValidatorModule,
    CreditModule,
  ],
})
export class RizeModule {}
