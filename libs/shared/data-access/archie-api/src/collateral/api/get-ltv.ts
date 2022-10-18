import { API_URL } from '@archie-webapps/shared/constants';
import { LTVStatus } from '@archie-webapps/shared/constants';

import { getRequest } from '../../helpers';

export interface LTV {
  ltv: number;
  status: LTVStatus;
}

export const ERROR_LIST = new Map<string, string>([]);

export const getLTV = async (accessToken: string): Promise<LTV> => {
  return getRequest<LTV>(
    `${API_URL}/v1/ltv`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
    ERROR_LIST,
  );
};
