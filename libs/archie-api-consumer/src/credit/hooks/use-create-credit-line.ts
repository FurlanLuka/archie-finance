import { MutationQueryResponse } from '../../interface';
import { createCreditLine } from '../api/create-credit-line';
import { useExtendedMutation } from '@archie/api-consumer/helper-hooks';
import { useQueryClient } from 'react-query';
import { ONBOARDING_RECORD_QUERY_KEY } from '@archie/api-consumer/onboarding/hooks/use-get-onboarding';

export const useCreateCreditLine = (): MutationQueryResponse => {
  const queryClient = useQueryClient();

  return useExtendedMutation('credit_line', createCreditLine, {
    onSuccess: () => {
      console.log('credit line creation successful!!');
      queryClient.invalidateQueries(ONBOARDING_RECORD_QUERY_KEY);
    },
  });
};
