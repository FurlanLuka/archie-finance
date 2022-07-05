import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  OnboardingQueueController,
  OnboardingController,
} from './onboarding.controller';
import { Onboarding } from './onboarding.entity';
import { OnboardingService } from './onboarding.service';

@Module({
  imports: [TypeOrmModule.forFeature([Onboarding])],
  controllers: [OnboardingController, OnboardingQueueController],
  providers: [OnboardingService],
  exports: [OnboardingService],
})
export class OnboardingModule {}
