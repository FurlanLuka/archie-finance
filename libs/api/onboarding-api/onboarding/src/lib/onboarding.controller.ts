import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { OnboardingService } from './onboarding.service';
import { AuthGuard } from '@archie/api/utils/auth0';
import {
  CompleteOnboardingStageDto,
  GetOnboardingResponseDto,
} from './onboarding.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import {
  KYC_SUBMITTED_TOPIC,
  EMAIL_VERIFIED_TOPIC,
  MFA_ENROLLED_TOPIC,
} from '@archie/api/user-api/constants';
import {
  COLLATERAL_RECEIVED_TOPIC,
  CARD_ACTIVATED_TOPIC,
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
  private static CONTROLLER_QUEUE_NAME = `${SERVICE_QUEUE_NAME}-onboarding`;

  constructor(private onboardingService: OnboardingService) {}

  @Subscribe(
    KYC_SUBMITTED_TOPIC,
    OnboardingQueueController.CONTROLLER_QUEUE_NAME,
  )
  async kycSubmittedEventHandler(
    payload: CompleteOnboardingStageDto,
  ): Promise<void> {
    await this.onboardingService.completeOnboardingStage(
      payload.userId,
      'kycStage',
    );
  }

  @Subscribe(
    EMAIL_VERIFIED_TOPIC,
    OnboardingQueueController.CONTROLLER_QUEUE_NAME,
  )
  async emailVerifiedEventHandler(
    payload: CompleteOnboardingStageDto,
  ): Promise<void> {
    await this.onboardingService.completeOnboardingStage(
      payload.userId,
      'emailVerificationStage',
    );
  }

  @Subscribe(
    MFA_ENROLLED_TOPIC,
    OnboardingQueueController.CONTROLLER_QUEUE_NAME,
  )
  async mfaEnrollmentEventHandler(
    payload: CompleteOnboardingStageDto,
  ): Promise<void> {
    await this.onboardingService.completeOnboardingStage(
      payload.userId,
      'mfaEnrollmentStage',
    );
  }

  @Subscribe(
    COLLATERAL_RECEIVED_TOPIC,
    OnboardingQueueController.CONTROLLER_QUEUE_NAME,
  )
  async collateralReceivedEventHandler(
    payload: CompleteOnboardingStageDto,
  ): Promise<void> {
    await this.onboardingService.completeOnboardingStage(
      payload.userId,
      'collateralizationStage',
    );
  }

  @Subscribe(
    CARD_ACTIVATED_TOPIC,
    OnboardingQueueController.CONTROLLER_QUEUE_NAME,
  )
  async cardActivatedEventHandler(
    payload: CompleteOnboardingStageDto,
  ): Promise<void> {
    await this.onboardingService.completeOnboardingStage(
      payload.userId,
      'cardActivationStage',
    );
  }
}
