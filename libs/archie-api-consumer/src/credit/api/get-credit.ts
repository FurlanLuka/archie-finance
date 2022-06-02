import { API_URL } from '../../constants';
import { getRequest } from '../../helpers';

export interface GetCreditResponse {
  totalCredit: number;
  availableCredit: number;
}

export const ERROR_LIST = new Map<string, string>([]);

export const getCredit = async (accessToken: string): Promise<GetCreditResponse> => {
  return getRequest<GetCreditResponse>(
    `${API_URL}/v1/credit`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
    ERROR_LIST,
  );
};
