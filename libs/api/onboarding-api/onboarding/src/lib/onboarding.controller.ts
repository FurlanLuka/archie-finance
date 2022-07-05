import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { OnboardingService } from './onboarding.service';
import { AuthGuard } from '@archie-microservices/auth0';
import {
  GetOnboardingResponseDto,
  CompleteOnboardingStageDto,
} from './onboarding.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { EventPattern, Payload } from '@nestjs/microservices';
import { EventPatterns } from '@archie/api/onboarding-api/constants';

@Controller('v1/onboarding')
export class OnboardingController {
  constructor(private onboardingService: OnboardingService) {}

  @Get()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  async getOnboardingRecord(@Request() req): Promise<GetOnboardingResponseDto> {
    return this.onboardingService.getOrCreateOnboardingRecord(req.user.sub);
  }
}

@Controller()
export class OnboardingQueueController {
  constructor(private onboardingService: OnboardingService) {}

  @EventPattern(EventPatterns.COMPLETE_ONBOARDING_STAGE)
  async completeOnboardingStage(
    @Payload() payload: CompleteOnboardingStageDto,
  ): Promise<void> {
    await this.onboardingService.completeOnboardingStage(
      payload.userId,
      payload.stage,
    );
  }
}
