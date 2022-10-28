import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { OnboardingService } from './onboarding.service';
import { AuthGuard } from '@archie/api/utils/auth0';
import { OnboardingDto } from '@archie/api/onboarding-api/data-transfer-objects';
import { ApiBearerAuth } from '@nestjs/swagger';
import {
  KYC_SUBMITTED_TOPIC,
  EMAIL_VERIFIED_TOPIC,
  MFA_ENROLLED_TOPIC,
  MFA_REMOVED_TOPIC,
} from '@archie/api/user-api/constants';
import { CARD_ACTIVATED_TOPIC } from '@archie/api/credit-api/constants';
import { SERVICE_QUEUE_NAME } from '@archie/api/onboarding-api/constants';
import { Subscribe } from '@archie/api/utils/queue/decorators/subscribe';
import {
  EmailVerifiedPayload,
  MfaRemovedPayload,
  MfaEnrolledPayload,
} from '@archie/api/user-api/data-transfer-objects';
import { KycSubmittedPayload } from '@archie/api/user-api/data-transfer-objects/types';
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
  async getOnboardingRecord(@Request() req): Promise<OnboardingDto> {
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
  async kycSubmittedEventHandler(payload: KycSubmittedPayload): Promise<void> {
    await this.onboardingService.updateOnboardingStage(
      payload.userId,
      'kycStage',
      true,
    );
  }

  @Subscribe(
    EMAIL_VERIFIED_TOPIC,
    OnboardingQueueController.CONTROLLER_QUEUE_NAME,
  )
  async emailVerifiedEventHandler(
    payload: EmailVerifiedPayload,
  ): Promise<void> {
    await this.onboardingService.updateOnboardingStage(
      payload.userId,
      'emailVerificationStage',
      true,
    );
  }

  @Subscribe(
    MFA_ENROLLED_TOPIC,
    OnboardingQueueController.CONTROLLER_QUEUE_NAME,
  )
  async mfaEnrollmentEventHandler(payload: MfaEnrolledPayload): Promise<void> {
    await this.onboardingService.updateOnboardingStage(
      payload.userId,
      'mfaEnrollmentStage',
      true,
    );
  }

  @Subscribe(
    CREDIT_LINE_CREATED_TOPIC,
    OnboardingQueueController.CONTROLLER_QUEUE_NAME,
  )
  async collateralReceivedEventHandler(
    payload: CollateralReceivedPayload,
  ): Promise<void> {
    await this.onboardingService.updateOnboardingStage(
      payload.userId,
      'collateralizationStage',
      true,
    );
  }

  @Subscribe(
    CARD_ACTIVATED_TOPIC,
    OnboardingQueueController.CONTROLLER_QUEUE_NAME,
  )
  async cardActivatedEventHandler(
    payload: CardActivatedPayload,
  ): Promise<void> {
    await this.onboardingService.updateOnboardingStage(
      payload.userId,
      'cardActivationStage',
      true,
    );
  }

  @Subscribe(MFA_REMOVED_TOPIC, OnboardingQueueController.CONTROLLER_QUEUE_NAME)
  async mfaRemovedEventHandler(payload: MfaRemovedPayload): Promise<void> {
    await this.onboardingService.updateOnboardingStage(
      payload.userId,
      'mfaEnrollmentStage',
      false,
    );
  }
}
