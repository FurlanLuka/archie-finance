import { useQueryClient } from 'react-query';

import { useExtendedMutation } from '../../helper-hooks';
import { MutationQueryResponse } from '../../interface';
import { ONBOARDING_RECORD_QUERY_KEY } from '../../onboarding/hooks/use-get-onboarding';
import { createCreditLine } from '../api/create-credit-line';

export const useCreateCreditLine = (): MutationQueryResponse => {
  const queryClient = useQueryClient();

  return useExtendedMutation('credit_line', createCreditLine, {
    onSuccess: () => {
      console.log('credit line creation successful!!');
      queryClient.invalidateQueries(ONBOARDING_RECORD_QUERY_KEY);
    },
  });
};
