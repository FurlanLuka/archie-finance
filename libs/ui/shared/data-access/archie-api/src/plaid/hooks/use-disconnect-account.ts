import { useQueryClient } from 'react-query';

import { useExtendedMutation } from '../../helper-hooks';
import { DefaultVariables } from '../../helpers';
import { MutationQueryResponse } from '../../interface';
import { disconnectAccount } from '../api/disconnect-account';

import { CONNECTED_ACCOUNTS_RECORD_QUERY_KEY } from './use-get-connected-accounts';

export const useDisconnectAccount = (accountId: string): MutationQueryResponse<void, DefaultVariables> => {
  const queryClient = useQueryClient();
  return useExtendedMutation<void, DefaultVariables>(
    `disconnect_account_${accountId}`,
    async ({ accessToken }) => {
      return disconnectAccount(accessToken, accountId);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(CONNECTED_ACCOUNTS_RECORD_QUERY_KEY);
      },
    },
  );
};
