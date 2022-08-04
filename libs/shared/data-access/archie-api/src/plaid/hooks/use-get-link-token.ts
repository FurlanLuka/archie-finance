import { useExtendedQuery } from '../../helper-hooks';
import { QueryResponse } from '../../interface';
import { getLinkToken, GetPlaidLinkTokenResponse } from '../api/get-link-token';

export const LINK_TOKEN_RECORD_QUERY_KEY = 'link_token_record';

export const useGetLinkToken = (): QueryResponse<GetPlaidLinkTokenResponse> => {
  return useExtendedQuery(LINK_TOKEN_RECORD_QUERY_KEY, async (accessToken: string) => getLinkToken(accessToken));
};
