import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { user } from '../../../test/test-data/user.data';
import { getMockRepositoryProvider } from '../../../test/unit-test-utils/mock.repository.utils';
import { Repository } from 'typeorm';
import { Onboarding } from './onboarding.entity';
import { OnboardingService } from './onboarding.service';
import { when } from 'jest-when';
import { getOnboardingEntityData } from './__data__/onboarding.service.data';
import { OnboardingStage } from './onboarding.interfaces';
import { BadRequestException } from '@nestjs/common';

describe('OnboardingService', () => {
  let service: OnboardingService;

  let onboardingRepository: Repository<Onboarding>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OnboardingService, getMockRepositoryProvider(Onboarding)],
    }).compile();

    service = module.get(OnboardingService);
    onboardingRepository = module.get(getRepositoryToken(Onboarding));
  });

  describe('#getOrCreateOnboardingRecord', () => {
    it('should return the onboarding record for user', async () => {
      const onboardingEntity = getOnboardingEntityData();

      when(onboardingRepository.findOneBy)
        .calledWith({
          userId: user.id,
        })
        .mockResolvedValue(onboardingEntity);

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { userId: _onboardingUserId, ...onboardingRecord } =
        onboardingEntity;

      await expect(
        service.getOrCreateOnboardingRecord(user.id),
      ).resolves.toStrictEqual(onboardingRecord);
    });

    it("should create new onboarding record and return it if it doesn't exist", async () => {
      when(onboardingRepository.findOneBy)
        .calledWith({
          userId: user.id,
        })
        .mockResolvedValue(undefined);

      await expect(
        service.getOrCreateOnboardingRecord(user.id),
      ).resolves.toStrictEqual({
        kycStage: false,
        emailVerificationStage: false,
        collateralizationStage: false,
        cardActivationStage: false,
        completed: false,
      });

      expect(onboardingRepository.save).toHaveBeenCalledWith({
        userId: user.id,
      });
    });
  });

  describe('#completeOnboardingStage', () => {
    it('should throw an error because onboarding is already finished', async () => {
      when(onboardingRepository.findOneBy)
        .calledWith({
          userId: user.id,
        })
        .mockResolvedValue(
          getOnboardingEntityData({
            completed: true,
          }),
        );

      await expect(
        service.completeOnboardingStage(user.id, OnboardingStage.KYC),
      ).rejects.toThrowError(BadRequestException);
    });

    it('should update onboarding stage', async () => {
      const onboardingRecord = getOnboardingEntityData();
      const onboardingRecordWithKycCompleted = getOnboardingEntityData({
        kycStage: true,
      });

      when(onboardingRepository.findOneBy)
        .calledWith({
          userId: user.id,
        })
        .mockResolvedValue(onboardingRecord);

      await expect(
        service.completeOnboardingStage(user.id, OnboardingStage.KYC),
      ).resolves.toStrictEqual(onboardingRecordWithKycCompleted);

      expect(onboardingRepository.update).toHaveBeenCalledWith(
        {
          userId: user.id,
        },
        {
          kycStage: true,
          completed: false,
        },
      );
    });

    it('should update the last onboarding stage and mark onboarding as completed', async () => {
      const onboardingRecord = getOnboardingEntityData({
        kycStage: false,
        completed: false,
        cardActivationStage: true,
        collateralizationStage: true,
        emailVerificationStage: true,
      });

      const completedOnboardingRecord = getOnboardingEntityData({
        kycStage: true,
        completed: true,
        cardActivationStage: true,
        collateralizationStage: true,
        emailVerificationStage: true,
      });

      when(onboardingRepository.findOneBy)
        .calledWith({
          userId: user.id,
        })
        .mockResolvedValue(onboardingRecord);

      await expect(
        service.completeOnboardingStage(user.id, OnboardingStage.KYC),
      ).resolves.toStrictEqual(completedOnboardingRecord);

      expect(onboardingRepository.update).toHaveBeenCalledWith(
        {
          userId: user.id,
        },
        {
          kycStage: true,
          completed: true,
        },
      );
    });
  });
});
