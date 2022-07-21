import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Credit } from '../credit/credit.entity';
import {
  MarginInternalController,
  MarginQueueController,
} from './margin.controller';
import { MarginService } from './margin.service';
import { LiquidationLog } from './liquidation_logs.entity';
import { MarginCall } from './margin_calls.entity';
import { MarginLtvModule } from './ltv/margin_ltv.module';
import { MarginCallsModule } from './calls/margin_calls.module';
import { Collateral } from '../collateral/collateral.entity';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { ConfigModule, ConfigService } from '@archie/api/utils/config';
import {
  ConfigVariables,
  CREDIT_LIMIT_ADJUST_REQUESTED_EXCHANGE,
  MARGIN_CHECK_REQUESTED_EXCHANGE,
} from '@archie/api/credit-api/constants';
import { MarginCollateralValueCheckModule } from './collateral_value_checks/margin_collateral_value_cheks.module';
import { CreditLimitModule } from './credit_limit/credit_limit.module';

@Module({
  controllers: [MarginQueueController, MarginInternalController],
  imports: [
    TypeOrmModule.forFeature([Credit, LiquidationLog, MarginCall, Collateral]),
    RabbitMQModule.forRootAsync(RabbitMQModule, {
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        exchanges: [
          MARGIN_CHECK_REQUESTED_EXCHANGE,
          CREDIT_LIMIT_ADJUST_REQUESTED_EXCHANGE,
        ],
        uri: configService.get(ConfigVariables.QUEUE_URL),
        connectionInitOptions: { wait: false },
      }),
    }),
    MarginLtvModule,
    MarginCallsModule,
    MarginCollateralValueCheckModule,
    CreditLimitModule,
  ],
  providers: [MarginService],
  exports: [MarginService],
})
export class MarginModule {}
