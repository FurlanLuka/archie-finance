import { API_URL } from '../../constants';
import { getRequest } from '../../helpers';

export interface AssetLimits {
  asset: string;
  limit: number;
  utilizationPercentage: number;
}

export interface CreditLineResponse {
  assetLimits: AssetLimits[];
  creditLimit: number; 
}

export const ERROR_LIST = new Map<string, string>([]);

export const getCreditLine = async (accessToken: string): Promise<CreditLineResponse> => {
  return getRequest<CreditLineResponse>(
    `${API_URL}/v1/credit_limits`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
    ERROR_LIST,
  );
};
