import { BigNumber } from 'bignumber.js';

import { calculateLedgerCreditValue } from '@archie-webapps/archie-dashboard/utils';
import { Ledger, LedgerAccountData } from '@archie-webapps/shared/data-access/archie-api-dtos';

interface GetUpdatedCreditAndTotalResult {
  updatedCreditValue: string;
  updatedLedgerValue: string;
}

export function getUpdatedCreditAndTotal({
  asset,
  withdrawalAmount,
  ledgerAccounts,
}: {
  asset: string;
  withdrawalAmount: string;
  ledgerAccounts: LedgerAccountData[];
}): GetUpdatedCreditAndTotalResult {
  const updatedLedgerAccounts = ledgerAccounts.map((ledgerAccount) => {
    if (ledgerAccount.assetId !== asset) {
      return ledgerAccount;
    }
    const newAmount = BigNumber(ledgerAccount.assetAmount).minus(withdrawalAmount);

    return {
      ...ledgerAccount,
      assetAmount: newAmount,
      accountValue: newAmount.multipliedBy(ledgerAccount.assetPrice).decimalPlaces(2, BigNumber.ROUND_DOWN).toString(),
    };
  });

  const updatedLedger: Ledger = {
    value: updatedLedgerAccounts
      .reduce((sum, ledgerAccount) => {
        return sum.plus(ledgerAccount.assetPrice);
      }, BigNumber(0))
      .toString(),
    accounts: ledgerAccounts,
  };

  return {
    updatedCreditValue: calculateLedgerCreditValue(updatedLedger.accounts),
    updatedLedgerValue: updatedLedger.value,
  };
}
