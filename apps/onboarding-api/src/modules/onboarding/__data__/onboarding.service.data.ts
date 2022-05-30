import { user } from '../../../../test/test-data/user.data';
import { Onboarding } from '../onboarding.entity';

export const getOnboardingEntityData = (
  overrides?: Partial<Onboarding>,
): Onboarding => {
  const defaultEntity: Onboarding = {
    userId: user.id,
    kycStage: false,
    collateralizationStage: false,
    emailVerificationStage: false,
    cardActivationStage: false,
    completed: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  return {
    ...defaultEntity,
    ...overrides,
  };
};
