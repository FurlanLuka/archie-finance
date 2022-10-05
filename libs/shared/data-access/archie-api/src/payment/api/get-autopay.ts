import { API_URL } from '../../constants';
import { getRequest } from '../../helpers';
import { Autopay } from '../payment.interfaces';

export const AUTOPAY_NOT_CONFIGURED = 'AUTOPAY_NOT_CONFIGURED';
export const ERROR_LIST = new Map<string, string>([[AUTOPAY_NOT_CONFIGURED, 'Autopay not configured']]);

export const getAutopay = async (accessToken: string): Promise<Autopay> => {
  return getRequest<Autopay>(
    `${API_URL}/v1/loan_autopay`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
    ERROR_LIST,
  );
};
