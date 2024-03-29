import {
  InternalLedgerAccountData,
  Ledger,
} from '@archie/api/ledger-api/data-transfer-objects/types';
import { queryClient } from '@archie/ui/shared/data-access/query-client';
import { LedgerUpdatedWsEvent } from '@archie/ui/shared/data-access/websocket-instance';
import {
  calculateLedgerTotalValue,
  mergeLedgerWithWsUpdate,
} from '@archie/ui/shared/utils';

import { LEDGER_QUERY_KEY } from '../hooks/use-get-ledger';

export const handleLedgerUpdatedEvent = (event: LedgerUpdatedWsEvent): void => {
  queryClient.setQueryData<Ledger | undefined>(
    LEDGER_QUERY_KEY,
    (data): Ledger | undefined => {
      if (data !== undefined) {
        const updatedAccounts = mergeLedgerWithWsUpdate(
          data.accounts,
          event.data.ledgerAccounts,
        );
        data.accounts.reduce(
          (
            newAccounts: InternalLedgerAccountData[],
            account: InternalLedgerAccountData,
          ) => {
            const updatedAccount = event.data.ledgerAccounts.find(
              (a) => a.assetId === account.assetId,
            );

            if (updatedAccount === undefined) {
              return [...newAccounts, account];
            }

            return [
              ...newAccounts,
              {
                assetId: updatedAccount.assetId,
                assetAmount: updatedAccount.assetAmount,
                assetPrice: account.assetPrice,
                accountValue: updatedAccount.accountValue,
              },
            ];
          },
          [],
        );

        return {
          ...data,
          accounts: updatedAccounts,
          value: calculateLedgerTotalValue(updatedAccounts).toString(),
        };
      }
      return undefined;
    },
  );
};
