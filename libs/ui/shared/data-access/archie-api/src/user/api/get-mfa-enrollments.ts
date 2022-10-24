import { API_URL } from '@archie/ui/shared/constants';

import { getRequest } from '../../helpers';

export interface MfaEnrollment {
  id: string;
  status: Record<string, unknown>;
  enrolled_at: string;
  last_auth: string;
  type: string;
  auth_method: Record<string, unknown>;
}

const ERROR_LIST = new Map<string, string>([]);

export const getMfaEnrollments = async (accessToken: string): Promise<MfaEnrollment[]> => {
  return getRequest(
    `${API_URL}/v1/user/mfa/enrollments`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
    ERROR_LIST,
  );
};