import {
  EmailVerifiedPayload,
  MfaDisEnrolledPayload,
  MfaEnrolledPayload,
} from '@archie/api/user-api/data-transfer-objects';
import { user } from '@archie/test/integration';

export const mfaEnrolledDataFactory = (
  override?: Partial<MfaEnrolledPayload>,
): MfaEnrolledPayload => ({
  userId: user.id,
  ...override,
});

export const mfaDisEnrolledDataFactory = (
  override?: Partial<MfaDisEnrolledPayload>,
): MfaDisEnrolledPayload => ({
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
