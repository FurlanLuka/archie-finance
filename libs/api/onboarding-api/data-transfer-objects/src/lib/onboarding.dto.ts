import { Onboarding } from './onboarding.interfaces';

export class OnboardingDto implements Onboarding {
  kycStage: boolean;
  emailVerificationStage: boolean;
  collateralizationStage: boolean;
  cardActivationStage: boolean;
  mfaEnrollmentStage: boolean;
  completed: boolean;
}
