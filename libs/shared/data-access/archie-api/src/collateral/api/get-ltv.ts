import { LTVStatus } from '@archie-webapps/shared/constants';

import { API_URL } from '../../constants';
import { getRequest } from '../../helpers';

export interface LTV {
  ltv: number;
  status: LTVStatus;
}

export const ERROR_LIST = new Map<string, string>([]);

export const getLTV = async (accessToken: string): Promise<LTV> => {
  return getRequest<LTV>(
    `${API_URL}/v1/margins/ltv`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
    ERROR_LIST,
  );
};
