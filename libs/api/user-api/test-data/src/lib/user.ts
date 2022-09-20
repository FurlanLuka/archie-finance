import {
  EmailVerifiedPayload,
  MfaEnrolledPayload,
} from '@archie/api/user-api/data-transfer-objects';
import { user } from '@archie/test/integration';

export const mfaEnrolledDataFactory = (
  override?: MfaEnrolledPayload,
): MfaEnrolledPayload => ({
  userId: user.id,
  ...override,
});

export const emailVerifiedDataFactory = (
  override?: EmailVerifiedPayload,
): EmailVerifiedPayload => ({
  userId: user.id,
  email: 'test@test.com',
  ...override,
});
