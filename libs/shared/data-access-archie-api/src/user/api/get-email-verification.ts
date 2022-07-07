import { API_URL } from '../../constants';
import { getRequest } from '../../helpers';

export interface GetEmailVerificationResponse {
  isVerified: boolean;
}

const ERROR_LIST = new Map<string, string>([]);

export const getEmailVerification = async (accessToken: string): Promise<GetEmailVerificationResponse> => {
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
