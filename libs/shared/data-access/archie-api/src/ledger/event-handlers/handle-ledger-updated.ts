import { calculateLedgerCreditValue } from '@archie-webapps/archie-dashboard/utils';
import { queryClient } from '@archie-webapps/shared/data-access/query-client';
import { LedgerUpdatedWsEvent } from '@archie-webapps/shared/data-access/websocket-instance';

import { Ledger, LedgerAccountData } from '../api/get-ledger';
import { LEDGER_QUERY_KEY } from '../hooks/use-poll-ledger';

// TODO handle new asset by doing some mergerino shennangerino
// TODO move total sum to helper
export const handleLedgerUpdatedEvent = (event: LedgerUpdatedWsEvent): void => {
  queryClient.setQueryData<Ledger | undefined>(LEDGER_QUERY_KEY, (data): Ledger | undefined => {
    if (data !== undefined) {
      const updatedAccounts: LedgerAccountData[] = data.accounts.reduce(
        (newAccounts: LedgerAccountData[], account: LedgerAccountData) => {
          const updatedAccount = event.data.ledgerAccounts.find((a) => a.assetId === account.assetId);

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
        value: updatedAccounts.reduce((sum, account): number => sum + Number(account.accountValue), 0).toString(),
      };
    }
    return undefined;
  });
};
