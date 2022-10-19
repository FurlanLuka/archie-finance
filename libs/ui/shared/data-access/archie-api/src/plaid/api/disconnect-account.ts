import { API_URL } from '@archie/ui/shared/constants';

import { deleteRequest } from '../../helpers';

export const ERROR_LIST = new Map<string, string>([]);

export const disconnectAccount = async (
  accessToken: string,
  accountId: string,
): Promise<void> => {
  return deleteRequest<void>(
    `${API_URL}/v1/payment_instruments/${accountId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
    ERROR_LIST,
  );
};
