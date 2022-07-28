import { API_URL } from '../../constants';
import { getRequest } from '../../helpers';

export interface EmailVerificationResponse {
  isVerified: boolean;
  email: string;
}

const ERROR_LIST = new Map<string, string>([]);

export const getEmailVerification = async (accessToken: string): Promise<EmailVerificationResponse> => {
  return getRequest<EmailVerificationResponse>(
    `${API_URL}/v1/user/email-verification`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
    ERROR_LIST,
  );
};
