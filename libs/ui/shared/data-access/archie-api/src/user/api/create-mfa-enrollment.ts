import { API_URL } from '@archie/ui/shared/constants';

import { DefaultVariables, postRequest } from '../../helpers';

export interface CreateMfaEnrollmentResponse {
  ticket_id: string;
  ticket_url: string;
}

const ERROR_LIST = new Map<string, string>([]);

export const createMfaEnrollment = async ({
  accessToken,
}: DefaultVariables): Promise<CreateMfaEnrollmentResponse> => {
  return postRequest(
    `${API_URL}/v1/user/mfa/enroll`,
    {},
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
    ERROR_LIST,
  );
};
