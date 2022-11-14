import { LoanBalances } from '@archie/api/peach-api/data-transfer-objects/types';
import { queryClient } from '@archie/ui/shared/data-access/query-client';
import { CreditBalanceUpdatedWsEvent } from '@archie/ui/shared/data-access/websocket-instance';

import { CREDIT_RECORD_QUERY_KEY } from '../hooks/use-get-credit';

export const handleCreditBalanceUpdatedEvent = (
  event: CreditBalanceUpdatedWsEvent,
): void => {
  queryClient.setQueryData<LoanBalances | undefined>(
    CREDIT_RECORD_QUERY_KEY,
    (data): LoanBalances | undefined => {
      if (data !== undefined) {
        return {
          ...data,
          availableCredit: event.data.availableCreditAmount,
          utilizationAmount: event.data.utilizationAmount,
          totalCredit: event.data.creditLimitAmount,
        };
      }
      return undefined;
    },
  );
};
