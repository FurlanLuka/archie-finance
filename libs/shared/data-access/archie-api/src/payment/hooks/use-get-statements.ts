import { useExtendedQuery } from '../../helper-hooks';
import { QueryResponse } from '../../interface';
import { getStatements, Statement } from '../api/get-statements';

const STATEMENTS_RECORD_QUERY_KEY = 'statements_record';

export const useGetStatements = (): QueryResponse<Statement[]> => {
  return useExtendedQuery(STATEMENTS_RECORD_QUERY_KEY, async (accessToken: string) => getStatements(accessToken));
};
