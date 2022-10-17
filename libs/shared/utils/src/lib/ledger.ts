import { LedgerAccountData, LedgerAccountDataWs } from '@archie-webapps/shared/data-access/archie-api-dtos';

export const mergeLedgerWithWsUpdate = (
  initialLedgerAccounts: LedgerAccountData[],
  wsAccounts: LedgerAccountDataWs[],
): LedgerAccountData[] => {
  const updatedExistingAccounts: LedgerAccountData[] = initialLedgerAccounts.reduce(
    (newAccounts: LedgerAccountData[], account: LedgerAccountData) => {
      const updatedAccount = wsAccounts.find((a) => a.assetId === account.assetId);

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

  const newAccounts: LedgerAccountData[] = wsAccounts
    .filter(
      (wsAccount) => !updatedExistingAccounts.find((updatedAccount) => updatedAccount.assetId === wsAccount.assetId),
    )
    .map((wsAccount) => ({
      assetId: wsAccount.assetId,
      assetAmount: wsAccount.assetAmount,
      assetPrice: '1000', // TODO use event value when BE is done
      accountValue: wsAccount.accountValue,
    }));

  return [...updatedExistingAccounts, ...newAccounts];
};

export const calculateLedgerTotalValue = (ledgerAccounts: LedgerAccountData[]): number =>
  ledgerAccounts.reduce((sum, account): number => sum + Number(account.accountValue), 0);
