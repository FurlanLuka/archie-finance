import { KycResponse } from '@archie/api/user-api/data-transfer-objects/types';

import { useExtendedMutation } from '../../helper-hooks';
import { MutationQueryResponse } from '../../interface';
import { createKyc, CreateKycPayload } from '../api/create-kyc';

export const useCreateKyc = (): MutationQueryResponse<
  CreateKycPayload,
  KycResponse
> => {
  return useExtendedMutation<KycResponse, CreateKycPayload>(
    'kyc_record',
    createKyc,
  );
};
