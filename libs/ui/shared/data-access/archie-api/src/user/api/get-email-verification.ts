import { EmailVerification } from '@archie/api/user-api/data-transfer-objects/types';
import { API_URL } from '@archie/ui/shared/constants';

import { getRequest } from '../../helpers';

const ERROR_LIST = new Map<string, string>([]);

export const getEmailVerification = async (accessToken: string): Promise<EmailVerification> => {
  return getRequest<EmailVerification>(
    `${API_URL}/v1/user/email-verification`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
    ERROR_LIST,
  );
};
