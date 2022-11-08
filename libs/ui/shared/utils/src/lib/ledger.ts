import {
  InternalLedgerAccountData,
  LedgerAccountData,
} from '@archie/api/ledger-api/data-transfer-objects/types';

export const mergeLedgerWithWsUpdate = (
  initialLedgerAccounts: InternalLedgerAccountData[],
  wsAccounts: LedgerAccountData[],
): InternalLedgerAccountData[] => {
  const updatedExistingAccounts: InternalLedgerAccountData[] =
    initialLedgerAccounts.reduce(
      (
        newAccounts: InternalLedgerAccountData[],
        account: InternalLedgerAccountData,
      ) => {
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

  const newAccounts: InternalLedgerAccountData[] = wsAccounts
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
  ledgerAccounts: InternalLedgerAccountData[],
): number =>
  ledgerAccounts.reduce(
    (sum, account): number => sum + Number(account.accountValue),
    0,
  );
