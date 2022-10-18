import { API_URL } from '@archie-webapps/shared/constants';

import { getRequest } from '../../helpers';

export interface LoanInterests {
  aprEffective: number;
  aprNominal: number;
}

export const ERROR_LIST = new Map<string, string>([]);

export const getLoanInterests = async (accessToken: string): Promise<LoanInterests> => {
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
