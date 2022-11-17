import { PaymentInstrument } from '@archie/api/peach-api/data-transfer-objects/types';
import { API_URL } from '@archie/ui/shared/constants';

import { getRequest } from '../../helpers';

export type GetConnectedAccountsResponse = PaymentInstrument[];

export const ERROR_LIST = new Map<string, string>([]);

export const getConnectedAccounts = async (
  accessToken: string,
): Promise<GetConnectedAccountsResponse> => {
  return getRequest<GetConnectedAccountsResponse>(
    `${API_URL}/v1/payment_instruments`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
    ERROR_LIST,
  );
};
