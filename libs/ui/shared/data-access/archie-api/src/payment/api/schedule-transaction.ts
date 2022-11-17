import { ScheduleTransaction } from '@archie/api/peach-api/data-transfer-objects/types';
import { API_URL } from '@archie/ui/shared/constants';

import { DefaultVariables, postRequest } from '../../helpers';

export interface ScheduleTransactionBody
  extends DefaultVariables,
    ScheduleTransaction {}

export const ERROR_LIST = new Map<string, string>([]);

export const scheduleTransaction = async ({
  accessToken,
  ...body
}: ScheduleTransactionBody): Promise<void> => {
  return postRequest(
    `${API_URL}/v1/loan_payments`,
    body,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
    ERROR_LIST,
  );
};
