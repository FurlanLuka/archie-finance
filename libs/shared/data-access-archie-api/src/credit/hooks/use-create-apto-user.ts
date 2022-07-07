import { useQueryClient } from 'react-query';

import { useExtendedMutation } from '../..//helper-hooks';
import { DefaultVariables } from '../..//helpers';
import { ONBOARDING_RECORD_QUERY_KEY } from '../..//onboarding/hooks/use-get-onboarding';
import { MutationQueryResponse } from '../../interface';
import { createAptoUser } from '../api/create-apto-user';

export const useCreateAptoUser = (): MutationQueryResponse => {
  const queryClient = useQueryClient();

  return useExtendedMutation<unknown, DefaultVariables>('apto_user_create', createAptoUser, {
    onSuccess: () => {
      console.log('apto user creation successful!!');
      queryClient.invalidateQueries(ONBOARDING_RECORD_QUERY_KEY);
    },
  });
};
