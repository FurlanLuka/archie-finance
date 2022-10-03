import { useExtendedQuery } from '../../helper-hooks';
import { QueryResponse } from '../../interface';
import { getMarginCalls, MarginCall, MarginCallStatus } from '../api/get-margin-calls';

export const MARGIN_CALLS_RECORD_QUERY_KEY = 'margin_calls_record';

export const useGetMarginCalls = (): QueryResponse<MarginCall[]> => {
  return useExtendedQuery(MARGIN_CALLS_RECORD_QUERY_KEY, async (accessToken: string) => {
    const marginCallsResponse = await getMarginCalls(accessToken);

    return marginCallsResponse.filter(item => item.status === MarginCallStatus.ACTIVE)
  });
};
