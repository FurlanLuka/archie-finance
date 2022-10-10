import { getLedger, Ledger } from '@archie-webapps/shared/data-access/archie-api/ledger/api/get-ledger';

import { useExtendedQuery } from '../../helper-hooks';
import { QueryResponse } from '../../interface';

export const LEDGER_QUERY_KEY = 'ledger';

export const usePollLedger = (enabled = true): QueryResponse<Ledger> => {
  return useExtendedQuery(
    LEDGER_QUERY_KEY,
    async (accessToken: string) => getLedger(accessToken),
    {
      enabled,
      refetchInterval: () => 10000,
    },
  );
};
