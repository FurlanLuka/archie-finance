import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InternalKycController, KycController } from './kyc.controller';
import { Kyc } from './kyc.entity';
import { KycService } from './kyc.service';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import {
  KYC_SUBMITTED_EXCHANGE,
  ConfigVariables,
} from '@archie/api/user-api/constants';
import { ConfigModule, ConfigService } from '@archie/api/utils/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Kyc]),
    RabbitMQModule.forRootAsync(RabbitMQModule, {
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        exchanges: [KYC_SUBMITTED_EXCHANGE],
        uri: configService.get(ConfigVariables.QUEUE_URL),
        connectionInitOptions: { wait: false },
      }),
    }),
  ],
  controllers: [KycController, InternalKycController],
  providers: [KycService],
})
export class KycModule {}
