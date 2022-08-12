import { API_URL } from '../../constants';
import { deleteRequest } from '../../helpers';

export const ERROR_LIST = new Map<string, string>([]);

export const disconnectAccount = async (accessToken: string, accountId: string): Promise<void> => {
  return deleteRequest<void>(
    `${API_URL}/v1/plaid/connected_accounts/${accountId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
    ERROR_LIST,
  );
};
