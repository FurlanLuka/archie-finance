import { Ltv } from '@archie/api/ltv-api/data-transfer-objects/types';
import { API_URL } from '@archie/ui/shared/constants';

import { getRequest } from '../../helpers';

export const ERROR_LIST = new Map<string, string>([]);

export const getLTV = async (accessToken: string): Promise<Ltv> => {
  return getRequest<Ltv>(
    `${API_URL}/v1/ltv`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
    ERROR_LIST,
  );
};
