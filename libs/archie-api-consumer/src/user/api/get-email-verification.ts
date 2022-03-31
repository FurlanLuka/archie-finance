import { API_URL } from '@archie/api-consumer/constants';
import { getRequest } from '@archie/api-consumer/helpers';

export interface GetEmailVerificationResponse {
  isVerified: boolean;
}

const ERROR_LIST = new Map<string, string>([]);

export const getEmailVerification = async (
  accessToken: string,
): Promise<GetEmailVerificationResponse> => {
  return getRequest<GetEmailVerificationResponse>(
    `${API_URL}/v1/user/email-verification`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
    ERROR_LIST,
  );
};
