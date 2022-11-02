import {
  EmailVerifiedPayload,
  MfaRemovedPayload,
  MfaEnrolledPayload,
} from '@archie/api/user-api/data-transfer-objects';
import { user } from '@archie/test/integration/stubs';

export const mfaEnrolledDataFactory = (
  override?: Partial<MfaEnrolledPayload>,
): MfaEnrolledPayload => ({
  userId: user.id,
  ...override,
});

export const mfaRemovedDataFactory = (
  override?: Partial<MfaRemovedPayload>,
): MfaRemovedPayload => ({
  userId: user.id,
  ...override,
});

export const emailVerifiedDataFactory = (
  override?: Partial<EmailVerifiedPayload>,
): EmailVerifiedPayload => ({
  userId: user.id,
  email: 'test@test.com',
  ...override,
});
