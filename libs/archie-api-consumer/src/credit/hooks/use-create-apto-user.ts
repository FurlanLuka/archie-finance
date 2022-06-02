import { MutationQueryResponse } from '../../interface';
import { createAptoUser } from '../api/create-apto-user';
import { useExtendedMutation } from '@archie/api-consumer/helper-hooks';
import { useQueryClient } from 'react-query';
import { ONBOARDING_RECORD_QUERY_KEY } from '@archie/api-consumer/onboarding/hooks/use-get-onboarding';
import { DefaultVariables } from '@archie/api-consumer/helpers';

export const useCreateAptoUser = (): MutationQueryResponse => {
  const queryClient = useQueryClient();

  return useExtendedMutation<unknown, DefaultVariables>('apto_user_create', createAptoUser, {
    onSuccess: () => {
      console.log('apto user creation successful!!');
      queryClient.invalidateQueries(ONBOARDING_RECORD_QUERY_KEY);
    },
  });
};
