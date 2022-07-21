import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { OnboardingService } from './onboarding.service';
import { AuthGuard } from '@archie/api/utils/auth0';
import {
  CompleteOnboardingStageDto,
  GetOnboardingResponseDto,
} from './onboarding.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import {
  KYC_SUBMITTED_EXCHANGE,
  EMAIL_VERIFIED_EXCHANGE,
  MFA_ENROLLED_EXCHANGE,
} from '@archie/api/user-api/constants';
import {
  COLLATERAL_RECEIVED_EXCHANGE,
  CARD_ACTIVATED_EXCHANGE,
} from '@archie/api/credit-api/constants';
import { SERVICE_QUEUE_NAME } from '@archie/api/onboarding-api/constants';
import { Subscribe } from '@archie/api/utils/queue';

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

  @Subscribe(KYC_SUBMITTED_EXCHANGE, SERVICE_QUEUE_NAME)
  async kycSubmittedEventHandler(
    payload: CompleteOnboardingStageDto,
  ): Promise<void> {
    await this.onboardingService.completeOnboardingStage(
      payload.userId,
      'kycStage',
    );
  }

  @Subscribe(EMAIL_VERIFIED_EXCHANGE, SERVICE_QUEUE_NAME)
  async emailVerifiedEventHandler(
    payload: CompleteOnboardingStageDto,
  ): Promise<void> {
    await this.onboardingService.completeOnboardingStage(
      payload.userId,
      'emailVerificationStage',
    );
  }

  @Subscribe(MFA_ENROLLED_EXCHANGE, SERVICE_QUEUE_NAME)
  async mfaEnrollmentEventHandler(
    payload: CompleteOnboardingStageDto,
  ): Promise<void> {
    await this.onboardingService.completeOnboardingStage(
      payload.userId,
      'mfaEnrollmentStage',
    );
  }

  @Subscribe(COLLATERAL_RECEIVED_EXCHANGE, SERVICE_QUEUE_NAME)
  async collateralReceivedEventHandler(
    payload: CompleteOnboardingStageDto,
  ): Promise<void> {
    await this.onboardingService.completeOnboardingStage(
      payload.userId,
      'collateralizationStage',
    );
  }

  @Subscribe(CARD_ACTIVATED_EXCHANGE, SERVICE_QUEUE_NAME)
  async cardActivatedEventHandler(
    payload: CompleteOnboardingStageDto,
  ): Promise<void> {
    await this.onboardingService.completeOnboardingStage(
      payload.userId,
      'cardActivationStage',
    );
  }
}
