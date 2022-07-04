import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Onboarding } from './onboarding.entity';
import { GetOnboardingResponse } from './onboarding.interfaces';
import { OnboardingAlreadyCompletedError } from './onboarding.errors';

@Injectable()
export class OnboardingService {
  constructor(
    @InjectRepository(Onboarding)
    private onboardingRepository: Repository<Onboarding>,
  ) {}

  async getOrCreateOnboardingRecord(
    userId: string,
  ): Promise<GetOnboardingResponse> {
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
        phoneVerificationStage: false,
        collateralizationStage: false,
        cardActivationStage: false,
        mfaEnrollmentStage: false,
        completed: false,
      };
    }

    delete onboardingRecord.userId;

    return onboardingRecord;
  }

  async completeOnboardingStage(
    userId: string,
    stage: string,
  ): Promise<Onboarding> {
    const onboardingRecord: Onboarding | null =
      await this.onboardingRepository.findOneBy({
        userId,
      });

    if (onboardingRecord.completed) {
      throw new OnboardingAlreadyCompletedError();
    }

    const updatedOnboardingRecord: Onboarding = {
      ...onboardingRecord,
      [stage]: true,
    };

    const isFinalRequiredOnboardingStep: boolean =
      updatedOnboardingRecord.cardActivationStage &&
      updatedOnboardingRecord.collateralizationStage &&
      updatedOnboardingRecord.kycStage &&
      updatedOnboardingRecord.phoneVerificationStage;

    await this.onboardingRepository.update(
      {
        userId,
      },
      {
        [stage]: true,
        completed: isFinalRequiredOnboardingStep,
      },
    );

    return {
      ...updatedOnboardingRecord,
      completed: isFinalRequiredOnboardingStep,
    };
  }
}
