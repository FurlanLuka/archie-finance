import { TransactionResponse } from '@archie/api/credit-api/data-transfer-objects/types';
import { API_URL } from '@archie/ui/shared/constants';

import { getRequest } from '../../helpers';

export const ERROR_LIST = new Map<string, string>([]);

export const getTransactions = async (
  page: number,
  pageSize: number,
  accessToken: string,
): Promise<TransactionResponse> => {
  return getRequest<TransactionResponse>(
    `${API_URL}/v1/rize/users/transactions?page=${page}&limit=${pageSize}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
    ERROR_LIST,
  );
};
