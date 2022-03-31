import { MutationQueryResponse } from '../../interface';
import {
  createKyc,
  CreateKycPayload,
  CreateKycResponse,
} from '../api/create-kyc';
import { useExtendedMutation } from '@archie/api-consumer/helper-hooks';
import { useQueryClient } from 'react-query';
import { ONBOARDING_RECORD_QUERY_KEY } from '@archie/api-consumer/onboarding/hooks/use-get-onboarding';

export const useCreateKyc = (): MutationQueryResponse<
  CreateKycPayload,
  CreateKycResponse
> => {
  const queryClient = useQueryClient();

  return useExtendedMutation<CreateKycResponse, CreateKycPayload>(
    'kyc_record',
    createKyc,
    {
      onSuccess: () => {
        console.log('successful!!');
        queryClient.invalidateQueries(ONBOARDING_RECORD_QUERY_KEY);
      },
    },
  );
};
