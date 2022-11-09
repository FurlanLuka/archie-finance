import { KycResponse } from '@archie/api/user-api/data-transfer-objects/types';

import { useExtendedQuery } from '../../helper-hooks';
import { QueryResponse } from '../../interface';
import { getKyc } from '../api/get-kyc';

export const KYC_RECORD_QUERY_KEY = 'kyc_record';

export const useGetKyc = (): QueryResponse<KycResponse> => {
  return useExtendedQuery(KYC_RECORD_QUERY_KEY, async (accessToken: string) =>
    getKyc(accessToken),
  );
};
