import { API_URL } from '@archie-microservices/ui/shared/constants';

import { deleteRequest } from '../../helpers';
import { AUTOPAY_NOT_CONFIGURED } from '../autopay.interfaces';

export const ERROR_LIST = new Map<string, string>([
  [AUTOPAY_NOT_CONFIGURED, 'Autopay not configured'],
]);

export const removeAutopay = async (accessToken: string): Promise<void> => {
  return deleteRequest<void>(
    `${API_URL}/v1/loan_autopay`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
    ERROR_LIST,
  );
};
