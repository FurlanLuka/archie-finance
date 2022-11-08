import { LoanBalances } from '@archie/api/peach-api/data-transfer-objects/types';
import { API_URL } from '@archie/ui/shared/constants';

import { getRequest } from '../../helpers';

export const ERROR_LIST = new Map<string, string>([]);

export const getCredit = async (accessToken: string): Promise<LoanBalances> => {
  return getRequest<LoanBalances>(
    `${API_URL}/v1/loan_balances`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
    ERROR_LIST,
  );
};
