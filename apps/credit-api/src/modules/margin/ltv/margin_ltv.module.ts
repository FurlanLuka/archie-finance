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
import { CollateralValueModule } from '../../collateral/value/collateral_value.module';

@Module({
  controllers: [],
  imports: [
    TypeOrmModule.forFeature([MarginNotification]),
    RabbitMQModule.forRootAsync(RabbitMQModule, {
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        exchanges: [LTV_LIMIT_APPROACHING_EXCHANGE],
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
