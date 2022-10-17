import { Ledger } from '@archie-webapps/shared/data-access/archie-api-dtos';

import { API_URL } from '../../constants';
import { getRequest } from '../../helpers';

export const ERROR_LIST = new Map<string, string>([]);

export const getLedger = async (accessToken: string): Promise<Ledger> => {
  return getRequest<Ledger>(
    `${API_URL}/v1/ledger`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
    ERROR_LIST,
  );
};
