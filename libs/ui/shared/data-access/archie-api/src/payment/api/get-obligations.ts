import { ObligationsResponse } from '@archie/api/peach-api/data-transfer-objects/types';
import { API_URL } from '@archie/ui/shared/constants';

import { getRequest } from '../../helpers';

export const MISSING_PAYMENT_INFO_ERROR = 'MISSING_PAYMENT_INFO_ERROR';
export const CREDIT_LINE_NOT_FOUND_ERROR = 'CREDIT_LINE_NOT_FOUND_ERROR';

export interface UserObligations {
  dueDate: Date;
  balanceOwed: number;
  fullBalance: number;
  interestOwed: number;
}
export const ERROR_LIST = new Map<string, string>([
  [CREDIT_LINE_NOT_FOUND_ERROR, 'obligation_api.credit_line_not_found'],
]);

export const getObligations = async (
  accessToken: string,
): Promise<ObligationsResponse> => {
  return getRequest<ObligationsResponse>(
    `${API_URL}/v1/loan_obligations`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
    ERROR_LIST,
  );
};
