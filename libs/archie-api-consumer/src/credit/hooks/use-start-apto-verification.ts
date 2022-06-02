import { MutationQueryResponse } from '../../interface';
import { startAptoVerification } from '../api/start-apto-verification';
import { useExtendedMutation } from '@archie/api-consumer/helper-hooks';
import { useQueryClient } from 'react-query';
import { ONBOARDING_RECORD_QUERY_KEY } from '@archie/api-consumer/onboarding/hooks/use-get-onboarding';
import { DefaultVariables } from '@archie/api-consumer/helpers';

export const useStartAptoVerification = (): MutationQueryResponse => {
  const queryClient = useQueryClient();

  return useExtendedMutation<unknown, DefaultVariables>('apto_verification_start', startAptoVerification, {
    onSuccess: () => {
      console.log('apto start successful!!');
      queryClient.invalidateQueries(ONBOARDING_RECORD_QUERY_KEY);
    },
  });
};
