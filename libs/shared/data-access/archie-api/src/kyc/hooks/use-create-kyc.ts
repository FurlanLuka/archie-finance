import { useExtendedMutation } from '../../helper-hooks';
import { MutationQueryResponse } from '../../interface';
import { createKyc, CreateKycPayload, CreateKycResponse } from '../api/create-kyc';

export const useCreateKyc = (): MutationQueryResponse<CreateKycPayload, CreateKycResponse> => {
  return useExtendedMutation<CreateKycResponse, CreateKycPayload>('kyc_record', createKyc);
};
