import { useQueryClient } from 'react-query';

import { ONBOARDING_RECORD_QUERY_KEY } from '../..//onboarding/hooks/use-get-onboarding';
import { useExtendedMutation } from '../../helper-hooks';
import { MutationQueryResponse } from '../../interface';
import { completeAptoVerification, CompleteAptoVerificationPayload } from '../api/complete-apto-verification';

export const useCompleteAptoVerification = (): MutationQueryResponse => {
  const queryClient = useQueryClient();

  return useExtendedMutation<unknown, CompleteAptoVerificationPayload>(
    'apto_verification_complete',
    completeAptoVerification,
    {
      onSuccess: () => {
        console.log('apto complete successful!!');
        queryClient.invalidateQueries(ONBOARDING_RECORD_QUERY_KEY);
      },
    },
  );
};
