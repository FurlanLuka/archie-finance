import {
  LedgerAccountData,
  LedgerAccountDataWs,
} from '@archie-microservices/ui/shared/data-access/archie-api-dtos';

export const mergeLedgerWithWsUpdate = (
  initialLedgerAccounts: LedgerAccountData[],
  wsAccounts: LedgerAccountDataWs[],
): LedgerAccountData[] => {
  const updatedExistingAccounts: LedgerAccountData[] =
    initialLedgerAccounts.reduce(
      (newAccounts: LedgerAccountData[], account: LedgerAccountData) => {
        const updatedAccount = wsAccounts.find(
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
            assetPrice: updatedAccount.assetPrice,
            accountValue: updatedAccount.accountValue,
          },
        ];
      },
      [],
    );

  const newAccounts: LedgerAccountData[] = wsAccounts
    .filter(
      (wsAccount) =>
        !updatedExistingAccounts.find(
          (updatedAccount) => updatedAccount.assetId === wsAccount.assetId,
        ),
    )
    .map((wsAccount) => ({
      assetId: wsAccount.assetId,
      assetAmount: wsAccount.assetAmount,
      assetPrice: wsAccount.assetPrice,
      accountValue: wsAccount.accountValue,
    }));

  return [...updatedExistingAccounts, ...newAccounts];
};

export const calculateLedgerTotalValue = (
  ledgerAccounts: LedgerAccountData[],
): number =>
  ledgerAccounts.reduce(
    (sum, account): number => sum + Number(account.accountValue),
    0,
  );
