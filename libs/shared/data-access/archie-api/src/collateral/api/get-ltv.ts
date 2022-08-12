import { API_URL } from '../../constants';
import { getRequest } from '../../helpers';

export enum LtvStatus {
  good = 'good',
  ok = 'ok',
  warning = 'warning',
  margin_call = 'margin_call',
}

export interface LTV {
  ltv: number;
  status: LtvStatus;
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
