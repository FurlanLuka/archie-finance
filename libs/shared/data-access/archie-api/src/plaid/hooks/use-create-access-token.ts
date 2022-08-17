import { useQueryClient } from 'react-query';

import { useExtendedMutation } from '../../helper-hooks';
import { MutationQueryResponse } from '../../interface';
import { createAccessToken, CreateAccessTokenBody, CreateAccessTokenResponse } from '../api/create-access-token';

import { getLinkableAccountsQueryKey } from './use-get-linkable-accounts';

export const useCreateAccessToken = (): MutationQueryResponse<CreateAccessTokenBody, CreateAccessTokenResponse> => {
  const queryClient = useQueryClient();
  return useExtendedMutation<CreateAccessTokenResponse, CreateAccessTokenBody>(
    'create_access_token',
    createAccessToken,
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(getLinkableAccountsQueryKey(data.itemId));
      },
    },
  );
};
