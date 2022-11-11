import { CreditLine } from '@archie/api/credit-line-api/data-transfer-objects/types';

import { useExtendedQuery } from '../../helper-hooks';
import { QueryResponse } from '../../interface';
import { getCreditLine } from '../api/get-credit-line';

export const CREDIT_LINE_QUERY_KEY = ['credit_line'];

export const useGetCreditLine = (): QueryResponse<CreditLine> => {
  return useExtendedQuery(CREDIT_LINE_QUERY_KEY, async (accessToken: string) =>
    getCreditLine(accessToken),
  );
};
