import { API_URL } from '@archie/ui/shared/constants';

import { getRequest } from '../../helpers';

export interface GetMfaEnrollmentResponse {
  isEnrolled: boolean;
}

const ERROR_LIST = new Map<string, string>([]);

export const getMfaEnrollment = async (
  accessToken: string,
): Promise<GetMfaEnrollmentResponse> => {
  return getRequest(
    `${API_URL}/v1/user/mfa/enrollment`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
    ERROR_LIST,
  );
};
