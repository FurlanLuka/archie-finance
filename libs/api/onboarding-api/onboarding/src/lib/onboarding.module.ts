import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  OnboardingQueueController,
  OnboardingController,
} from './onboarding.controller';
import { Onboarding } from './onboarding.entity';
import { OnboardingService } from './onboarding.service';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { KYC_SUBMITTED_EXCHANGE } from '@archie/api/user-api/constants';
import { ConfigVariables } from '@archie/api/onboarding-api/constants';
import { ConfigModule, ConfigService } from '@archie-microservices/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Onboarding]),
    RabbitMQModule.forRootAsync(RabbitMQModule, {
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        exchanges: [KYC_SUBMITTED_EXCHANGE],
        uri: configService.get(ConfigVariables.QUEUE_URL),
        connectionInitOptions: { wait: false },
        enableControllerDiscovery: true,
        connectionManagerOptions: {
          heartbeatIntervalInSeconds: 10,
        },
      }),
    }),
  ],
  controllers: [OnboardingController, OnboardingQueueController],
  providers: [OnboardingService],
  exports: [OnboardingService],
})
export class OnboardingModule {}