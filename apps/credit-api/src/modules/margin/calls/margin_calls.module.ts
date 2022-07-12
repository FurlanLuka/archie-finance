import { Module } from '@nestjs/common';
import { MarginCallsService } from './margin_calls.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MarginNotification } from '../margin_notifications.entity';
import { MarginCall } from '../margin_calls.entity';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { ConfigModule, ConfigService } from '@archie-microservices/config';
import {
  ConfigVariables,
  MARGIN_CALL_COMPLETED_EXCHANGE,
  MARGIN_CALL_STARTED_EXCHANGE,
} from '@archie/api/credit-api/constants';
import { MarginLiquidationModule } from './liquidation/margin_liquidation.module';
import { MarginLtvModule } from '../ltv/margin_ltv.module';

@Module({
  controllers: [],
  imports: [
    TypeOrmModule.forFeature([MarginNotification, MarginCall]),
    RabbitMQModule.forRootAsync(RabbitMQModule, {
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        exchanges: [
          MARGIN_CALL_COMPLETED_EXCHANGE,
          MARGIN_CALL_COMPLETED_EXCHANGE,
          MARGIN_CALL_STARTED_EXCHANGE,
        ],
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
