import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Onboarding } from './onboarding.entity';
import {
  GetOnboardingResponse,
  OnboardingStage,
} from './onboarding.interfaces';

@Injectable()
export class OnboardingService {
  constructor(
    @InjectRepository(Onboarding)
    private onboardingRepository: Repository<Onboarding>,
  ) {}

  async getOrCreateOnboardingRecord(
    userId: string,
  ): Promise<GetOnboardingResponse> {
    const onboardingRecord: Onboarding | undefined =
      await this.onboardingRepository.findOne({
        userId,
      });

    if (onboardingRecord === undefined) {
      await this.onboardingRepository.save({
        userId,
      });

      return {
        kycStage: false,
        emailVerificationStage: false,
        collateralizationStage: false,
        cardActivationStage: false,
        completed: false,
      };
    }

    delete onboardingRecord.userId;

    return onboardingRecord;
  }

  async completeOnboardingStage(
    userId: string,
    stage: OnboardingStage,
  ): Promise<Onboarding> {
    const onboardingRecord: Onboarding | undefined =
      await this.onboardingRepository.findOne({
        userId,
      });

    if (onboardingRecord.completed) {
      throw new BadRequestException('Onboarding already completed');
    }

    const updatedOnboardingRecord: Onboarding = {
      ...onboardingRecord,
      [stage]: true,
    };

    const isFinalOnboardingStep: boolean =
      updatedOnboardingRecord.cardActivationStage &&
      updatedOnboardingRecord.collateralizationStage &&
      updatedOnboardingRecord.emailVerificationStage &&
      updatedOnboardingRecord.kycStage;

    await this.onboardingRepository.update(
      {
        userId,
      },
      {
        [stage]: true,
        completed: isFinalOnboardingStep,
      },
    );

    return {
      ...updatedOnboardingRecord,
      completed: isFinalOnboardingStep,
    };
  }
}
