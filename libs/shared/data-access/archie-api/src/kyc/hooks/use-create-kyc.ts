import { useQueryClient } from 'react-query';

import { useExtendedMutation } from '../../helper-hooks';
import { MutationQueryResponse } from '../../interface';
import { ONBOARDING_RECORD_QUERY_KEY } from '../../onboarding/hooks/use-get-onboarding';
import { createKyc, CreateKycPayload, CreateKycResponse } from '../api/create-kyc';

export const useCreateKyc = (): MutationQueryResponse<CreateKycPayload, CreateKycResponse> => {
  const queryClient = useQueryClient();

  return useExtendedMutation<CreateKycResponse, CreateKycPayload>('kyc_record', createKyc, {
    onSuccess: () => {
      queryClient.invalidateQueries(ONBOARDING_RECORD_QUERY_KEY);
    },
  });
};
