import { useExtendedQuery } from '../../helper-hooks';
import { QueryResponse } from '../../interface';
import { getAutopay } from '../api/get-autopay';
import { Autopay } from '../payment.interfaces';

const AUTOPAY_RECORD_QUERY_KEY = 'autopay_record';

export const useGetAutopay = (): QueryResponse<Autopay> => {
  return useExtendedQuery(AUTOPAY_RECORD_QUERY_KEY, async (accessToken: string) => getAutopay(accessToken));
};
