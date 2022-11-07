import { useQueryClient } from 'react-query';

import { useExtendedMutation } from '../../helper-hooks';
import { MutationQueryResponse } from '../../interface';
import { connectAccount, ConnectAccountBody } from '../api/connect-account';

import { CONNECTED_ACCOUNTS_RECORD_QUERY_KEY } from './use-get-connected-accounts';

export const useConnectAccount = (): MutationQueryResponse<void, ConnectAccountBody> => {
  const queryClient = useQueryClient();
  return useExtendedMutation<void, ConnectAccountBody>('connect_account', connectAccount, {
    onSuccess: () => {
      queryClient.invalidateQueries(CONNECTED_ACCOUNTS_RECORD_QUERY_KEY);
    },
  });
};
