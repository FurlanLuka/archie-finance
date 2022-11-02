import { user } from '@archie/test/integration/stubs';
import { OnboardingUpdatedPayload } from '@archie/api/onboarding-api/data-transfer-objects';

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
