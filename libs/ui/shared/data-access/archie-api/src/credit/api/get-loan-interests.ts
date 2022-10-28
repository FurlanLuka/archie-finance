import { LoanInterests } from '@archie/api/peach-api/data-transfer-objects/types';
import { API_URL } from '@archie/ui/shared/constants';

import { getRequest } from '../../helpers';

export const ERROR_LIST = new Map<string, string>([]);

export const getLoanInterests = async (
  accessToken: string,
): Promise<LoanInterests> => {
  return getRequest<LoanInterests>(
    `${API_URL}/v1/loan_interests`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
    ERROR_LIST,
  );
};
