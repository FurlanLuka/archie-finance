import { useQueryClient } from 'react-query';

import { useExtendedMutation } from '../../helper-hooks';
import { MutationQueryResponse } from '../../interface';
import { createAccessToken, CreateAccessTokenBody } from '../api/create-access-token';

import { ACCOUNTS_RECORD_QUERY_KEY } from './use-get-accounts';

export const useCreateAccessToken = (): MutationQueryResponse<CreateAccessTokenBody> => {
  const queryClient = useQueryClient();
  return useExtendedMutation<void, CreateAccessTokenBody>('create_access_token', createAccessToken, {
    onSuccess: () => {
      queryClient.invalidateQueries(ACCOUNTS_RECORD_QUERY_KEY);
    },
  });
};
