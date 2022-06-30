import { useQueryClient } from 'react-query';

import { useExtendedMutation } from '../../helper-hooks';
import { DefaultVariables } from '../../helpers';
import { MutationQueryResponse } from '../../interface';
import { ONBOARDING_RECORD_QUERY_KEY } from '../../onboarding/hooks/use-get-onboarding';
import { startAptoVerification } from '../api/start-apto-verification';

export const useStartAptoVerification = (): MutationQueryResponse => {
  const queryClient = useQueryClient();

  return useExtendedMutation<unknown, DefaultVariables>('apto_verification_start', startAptoVerification, {
    onSuccess: () => {
      console.log('apto start successful!!');
      queryClient.invalidateQueries(ONBOARDING_RECORD_QUERY_KEY);
    },
  });
};
