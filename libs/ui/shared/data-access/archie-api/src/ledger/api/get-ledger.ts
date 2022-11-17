import { Ledger } from '@archie/api/ledger-api/data-transfer-objects/types';
import { API_URL } from '@archie/ui/shared/constants';

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
