import { user } from '@archie/test/integration/data-stubs';
import { OnboardingUpdatedPayload } from '@archie/api/onboarding-api/data-transfer-objects/types';

export const onboardingUpdatedPayloadFactory = (
  overrides?: Partial<OnboardingUpdatedPayload>,
): OnboardingUpdatedPayload => ({
  userId: user.id,
  kycStage: false,
  cardActivationStage: false,
  completed: false,
  mfaEnrollmentStage: false,
  collateralizationStage: false,
  emailVerificationStage: false,
  ...overrides,
});
