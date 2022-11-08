import { PaymentsResponse } from '@archie/api/peach-api/data-transfer-objects/types';
import { API_URL } from '@archie/ui/shared/constants';

import { getRequest } from '../../helpers';

export const ERROR_LIST = new Map<string, string>([]);

export const getLoanPayments = (
  accessToken: string,
  fromDate: string,
  toDate: string,
) => {
  return getRequest<PaymentsResponse>(
    `${API_URL}/v1/loan_payments?fromEffectiveDate=${fromDate}&toEffectiveDate=${toDate}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
    ERROR_LIST,
  );
};
