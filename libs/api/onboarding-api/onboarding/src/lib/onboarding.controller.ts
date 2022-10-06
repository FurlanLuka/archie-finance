import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { OnboardingService } from './onboarding.service';
import { AuthGuard } from '@archie/api/utils/auth0';
import { GetOnboardingResponseDto } from './onboarding.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import {
  KYC_SUBMITTED_TOPIC,
  EMAIL_VERIFIED_TOPIC,
  MFA_ENROLLED_TOPIC,
} from '@archie/api/user-api/constants';
import { CARD_ACTIVATED_TOPIC } from '@archie/api/credit-api/constants';
import { SERVICE_QUEUE_NAME } from '@archie/api/onboarding-api/constants';
import { Subscribe } from '@archie/api/utils/queue';
import {
  EmailVerifiedPayload,
  KycSubmittedPayload,
  MfaEnrolledPayload,
} from '@archie/api/user-api/data-transfer-objects';
import {
  CardActivatedPayload,
  CollateralReceivedPayload,
} from '@archie/api/credit-api/data-transfer-objects';
import { CREDIT_LINE_CREATED_TOPIC } from '@archie/api/credit-line-api/constants';

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
    { logBody: false },
  )
  async kycSubmittedEventHandler(payload: KycSubmittedPayload): Promise<void> {
    await this.onboardingService.completeOnboardingStage(
      payload.userId,
      'kycStage',
    );
  }

  @Subscribe(
    EMAIL_VERIFIED_TOPIC,
    OnboardingQueueController.CONTROLLER_QUEUE_NAME,
    { logBody: false },
  )
  async emailVerifiedEventHandler(
    payload: EmailVerifiedPayload,
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
  async mfaEnrollmentEventHandler(payload: MfaEnrolledPayload): Promise<void> {
    await this.onboardingService.completeOnboardingStage(
      payload.userId,
      'mfaEnrollmentStage',
    );
  }

  @Subscribe(
    CREDIT_LINE_CREATED_TOPIC,
    OnboardingQueueController.CONTROLLER_QUEUE_NAME,
  )
  async collateralReceivedEventHandler(
    payload: CollateralReceivedPayload,
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
    payload: CardActivatedPayload,
  ): Promise<void> {
    await this.onboardingService.completeOnboardingStage(
      payload.userId,
      'cardActivationStage',
    );
  }
}
