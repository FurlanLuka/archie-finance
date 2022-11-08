import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Onboarding } from './onboarding.entity';
import { Onboarding as OnboardingResponse } from '@archie/api/onboarding-api/data-transfer-objects/types';
import { QueueService } from '@archie/api/utils/queue';
import { ONBOARDING_UPDATED_TOPIC } from '@archie/api/onboarding-api/constants';

@Injectable()
export class OnboardingService {
  constructor(
    @InjectRepository(Onboarding)
    private onboardingRepository: Repository<Onboarding>,
    private queueService: QueueService,
  ) {}

  async getOrCreateOnboardingRecord(
    userId: string,
  ): Promise<OnboardingResponse> {
    const onboardingRecord: Onboarding | null =
      await this.onboardingRepository.findOneBy({
        userId,
      });

    if (onboardingRecord === null) {
      await this.onboardingRepository.save({
        userId,
      });

      return {
        kycStage: false,
        emailVerificationStage: false,
        collateralizationStage: false,
        cardActivationStage: false,
        mfaEnrollmentStage: false,
        completed: false,
      };
    }

    const { userId: _, ...onboardingRecordWithoutUserId } = onboardingRecord;

    return onboardingRecordWithoutUserId;
  }

  async updateOnboardingStage(
    userId: string,
    stage: string,
    complete: boolean,
  ): Promise<Onboarding> {
    const onboardingRecord: Onboarding | null =
      await this.onboardingRepository.findOneBy({
        userId,
      });

    if (onboardingRecord === null) {
      throw new Error('ONBOARDING_RECORD_NOT_SETUP_YET');
    }

    const updatedOnboardingRecord: Onboarding = {
      ...onboardingRecord,
      [stage]: complete,
    };

    const isFinalRequiredOnboardingStep: boolean =
      updatedOnboardingRecord.cardActivationStage &&
      updatedOnboardingRecord.collateralizationStage &&
      updatedOnboardingRecord.kycStage;

    await this.onboardingRepository.update(
      {
        userId,
      },
      {
        [stage]: complete,
        completed: isFinalRequiredOnboardingStep,
      },
    );

    const onboarding: Onboarding = {
      ...updatedOnboardingRecord,
      completed: isFinalRequiredOnboardingStep,
    };

    this.queueService.publishEvent(ONBOARDING_UPDATED_TOPIC, onboarding);

    return onboarding;
  }
}
