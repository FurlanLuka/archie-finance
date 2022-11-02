import { user } from '../../../../test/integration/src/lib/data-stubs';
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
