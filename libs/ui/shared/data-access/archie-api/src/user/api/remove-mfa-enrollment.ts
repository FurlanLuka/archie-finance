import { API_URL } from '@archie/ui/shared/constants';

import { deleteRequest } from '../../helpers';

export const ERROR_LIST = new Map<string, string>([['MFA_ENROLLMENT_NOT_CONFIGURED', 'Mfa Enrollment not configured']]);

export const removeMfaEnrollment = async (accessToken: string, enrollmentId: string): Promise<void> => {
  return deleteRequest<void>(
    `${API_URL}/v1/user/mfa/enrollments/${enrollmentId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
    ERROR_LIST,
  );
};