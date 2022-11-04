import { API_URL } from '@archie/ui/shared/constants';

import { DefaultVariables, deleteRequest } from '../../helpers';

export interface RemoveMfaEnrollmentBody extends DefaultVariables {
  mfaEnrollmentId: string;
}

export const ERROR_LIST = new Map<string, string>([['MFA_ENROLLMENT_NOT_CONFIGURED', 'Mfa Enrollment not configured']]);

export const removeMfaEnrollment = async ({ accessToken, mfaEnrollmentId }: RemoveMfaEnrollmentBody): Promise<void> => {
  return deleteRequest<void>(
    `${API_URL}/v1/user/mfa/enrollments/${mfaEnrollmentId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
    ERROR_LIST,
  );
};
