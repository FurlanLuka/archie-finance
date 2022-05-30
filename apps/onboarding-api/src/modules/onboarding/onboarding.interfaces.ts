import { Onboarding } from './onboarding.entity';

export enum OnboardingStage {
  KYC = 'kycStage',
  EMAIL_VERIFICATION = 'emailVerificationStage',
  COLLATERALIZATION = 'collateralizationStage',
  CARD_ACTIVATION = 'cardActivationStage',
  COMPLETED = 'completed',
}

export type GetOnboardingResponse = Omit<
  Onboarding,
  'userId' | 'updatedAt' | 'createdAt'
>;
