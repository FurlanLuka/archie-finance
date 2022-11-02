import { SendEnrollmentTicketResponse } from '@archie/api/user-api/data-transfer-objects/types';
import { API_URL } from '@archie/ui/shared/constants';

import { DefaultVariables, postRequest } from '../../helpers';

const ERROR_LIST = new Map<string, string>([]);

export const createMfaEnrollment = async ({ accessToken }: DefaultVariables): Promise<SendEnrollmentTicketResponse> => {
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
