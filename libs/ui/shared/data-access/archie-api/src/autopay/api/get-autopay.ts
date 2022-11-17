import { AutopayResponse } from '@archie/api/peach-api/data-transfer-objects/types';
import { API_URL } from '@archie/ui/shared/constants';

import { getRequest } from '../../helpers';
import { AUTOPAY_NOT_CONFIGURED } from '../autopay.interfaces';

export const ERROR_LIST = new Map<string, string>([
  [AUTOPAY_NOT_CONFIGURED, 'Autopay not configured'],
]);

export const getAutopay = async (
  accessToken: string,
): Promise<AutopayResponse> => {
  return getRequest<AutopayResponse>(
    `${API_URL}/v1/loan_autopay`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
    ERROR_LIST,
  );
};
