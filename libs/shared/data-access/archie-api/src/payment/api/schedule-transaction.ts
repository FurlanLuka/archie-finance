import { API_URL } from '@archie-webapps/shared/constants';

import { DefaultVariables, postRequest } from '../../helpers';

export interface ScheduleTransactionParams {
  amount: number;
  scheduledDate: string;
  paymentInstrumentId: string;
}

export interface ScheduleTransactionBody extends DefaultVariables, ScheduleTransactionParams {}

export const ERROR_LIST = new Map<string, string>([]);

export const scheduleTransaction = async ({ accessToken, ...body }: ScheduleTransactionBody): Promise<void> => {
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
