import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  OnboardingQueueController,
  OnboardingController,
} from './onboarding.controller';
import { Onboarding } from './onboarding.entity';
import { OnboardingService } from './onboarding.service';
import { ConfigVariables } from '@archie/api/onboarding-api/constants';
import { ConfigModule, ConfigService } from '@archie/api/utils/config';
import { RabbitMQCustomModule } from '@archie/api/utils/queue';

@Module({
  imports: [
    TypeOrmModule.forFeature([Onboarding]),
    RabbitMQCustomModule.forRootAsync(RabbitMQCustomModule, {
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
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
