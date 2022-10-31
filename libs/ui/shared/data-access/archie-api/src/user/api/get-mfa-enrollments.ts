import { API_URL } from '@archie/ui/shared/constants';

import { getRequest } from '../../helpers';

export enum EnrollmentStatus {
  CONFIRMED = 'confirmed',
  PENDING = 'pending',
}

export interface MfaEnrollment {
  id: string;
  status: EnrollmentStatus;
  enrolled_at: string;
  last_auth: string;
  type: string;
  auth_method: string;
}

const ERROR_LIST = new Map<string, string>([]);

export const getMfaEnrollments = async (accessToken: string): Promise<MfaEnrollment[]> => {
  return getRequest<MfaEnrollment[]>(
    `${API_URL}/v1/user/mfa/enrollments`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        status: EnrollmentStatus.CONFIRMED,
      },
    },
    ERROR_LIST,
  );
};