import { useExtendedQuery } from '../../helper-hooks';
import { QueryResponse } from '../../interface';
import { getKyc, Kyc } from '../api/get-kyc';

export const KYC_RECORD_QUERY_KEY = 'kyc_record';

export const useGetKyc = (): QueryResponse<Kyc> => {
  return useExtendedQuery(KYC_RECORD_QUERY_KEY, async (accessToken: string) => getKyc(accessToken));
};
