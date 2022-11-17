import { Enrollment } from '@archie/api/user-api/data-transfer-objects/types';
import { API_URL } from '@archie/ui/shared/constants';

import { getRequest } from '../../helpers';

const ERROR_LIST = new Map<string, string>([]);

export const getMfaEnrollments = async (
  accessToken: string,
): Promise<Enrollment[]> => {
  return getRequest<Enrollment[]>(
    `${API_URL}/v1/user/mfa/enrollments`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        // auth 0 doesn't have this as enum?
        status: 'confirmed',
      },
    },
    ERROR_LIST,
  );
};
