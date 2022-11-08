import { ConnectAccountBody as ConnectAccountParams } from '@archie/api/peach-api/data-transfer-objects/types';
import { API_URL } from '@archie/ui/shared/constants';

import { DefaultVariables, postRequest } from '../../helpers';

export interface ConnectAccountBody
  extends DefaultVariables,
    ConnectAccountParams {}

export const ERROR_LIST = new Map<string, string>([]);

export const connectAccount = async ({
  accessToken,
  ...body
}: ConnectAccountBody): Promise<void> => {
  return postRequest(
    `${API_URL}/v1/payment_instruments`,
    body,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
    ERROR_LIST,
  );
};
