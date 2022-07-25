import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@archie/api/utils/config';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import {
  ConfigVariables,
  CREDIT_LIMIT_DECREASED,
  CREDIT_LIMIT_INCREASED,
} from '@archie/api/credit-api/constants';
import { CreditModule } from '../../credit/credit.module';
import { CreditLimitService } from './credit_limit.service';
import { Credit } from '../../credit/credit.entity';

@Module({
  controllers: [],
  imports: [
    TypeOrmModule.forFeature([Credit]),
    RabbitMQModule.forRootAsync(RabbitMQModule, {
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        exchanges: [CREDIT_LIMIT_DECREASED, CREDIT_LIMIT_INCREASED],
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
