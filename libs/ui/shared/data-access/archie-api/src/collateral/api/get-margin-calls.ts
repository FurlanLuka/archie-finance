import { API_URL } from '@archie/ui/shared/constants';

import { getRequest } from '../../helpers';

export enum MarginCallStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
}

export interface MarginCall {
  status: MarginCallStatus;
  automaticLiquidationAt: string;
  createdAt: string;
}

export const ERROR_LIST = new Map<string, string>([]);

export const getMarginCalls = async (
  accessToken: string,
): Promise<MarginCall[]> => {
  return getRequest<MarginCall[]>(
    `${API_URL}/v1/margin_calls`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        status: MarginCallStatus.ACTIVE,
      },
    },
    ERROR_LIST,
  );
};