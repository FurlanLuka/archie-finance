import { API_URL } from '../../constants';
import { getRequest } from '../../helpers';

export interface TotalCollateralValue {
  value: number;
}

export const ERROR_LIST = new Map<string, string>([]);

export const getCollateralTotalValue = async (accessToken: string): Promise<TotalCollateralValue> => {
  return getRequest<TotalCollateralValue>(
    `${API_URL}/v1/collateral/value/total`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
    ERROR_LIST,
  );
};
