import { MarginCall, MarginCallStatus } from '@archie/api/ltv-api/data-transfer-objects/types';
import { API_URL } from '@archie/ui/shared/constants';

import { getRequest } from '../../helpers';

export const ERROR_LIST = new Map<string, string>([]);

export const getMarginCalls = async (accessToken: string): Promise<MarginCall[]> => {
  return getRequest<MarginCall[]>(
    `${API_URL}/v1/margin_calls`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        status: MarginCallStatus.active,
      },
    },
    ERROR_LIST,
  );
};
