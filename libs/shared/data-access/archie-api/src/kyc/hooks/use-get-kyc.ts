import { useExtendedQuery } from '../../helper-hooks';
import { QueryResponse } from '../../interface';
import { getKyc, KycResponse } from '../api/get-kyc';

export const KYC_RECORD_QUERY_KEY = 'kyc_record';

export const useGetKyc = (): QueryResponse<KycResponse> => {
  return useExtendedQuery(KYC_RECORD_QUERY_KEY, async (accessToken: string) => getKyc(accessToken));
};
