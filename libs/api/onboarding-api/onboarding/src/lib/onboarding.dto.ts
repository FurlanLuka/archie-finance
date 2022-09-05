import { GetOnboardingResponse } from './onboarding.interfaces';

export class GetOnboardingResponseDto implements GetOnboardingResponse {
  kycStage: boolean;
  emailVerificationStage: boolean;
  collateralizationStage: boolean;
  cardActivationStage: boolean;
  mfaEnrollmentStage: boolean;
  completed: boolean;
}
