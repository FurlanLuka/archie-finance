import { useQueryClient } from 'react-query';

import { useExtendedMutation } from '../../helper-hooks';
import { DefaultVariables } from '../../helpers';
import { ONBOARDING_RECORD_QUERY_KEY } from '../../onboarding/hooks/use-get-onboarding';
import { MutationQueryResponse } from '../../interface';
import { createRizeUser } from '../api/create-rize-user';

export const useCreateRizeUser = (): MutationQueryResponse => {
  const queryClient = useQueryClient();

  return useExtendedMutation<unknown, DefaultVariables>('rize_user_create', createRizeUser, {
    onSuccess: () => {
      console.log('Rize user creation successful!!');
      queryClient.invalidateQueries(ONBOARDING_RECORD_QUERY_KEY);
    },
  });
};
