import { BigNumber } from 'bignumber.js';

import {
  InternalLedgerAccountData,
  Ledger,
} from '@archie/api/ledger-api/data-transfer-objects/types';
import { calculateLedgerCreditValue } from '@archie/ui/dashboard/utils';

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
  ledgerAccounts: InternalLedgerAccountData[];
}): GetUpdatedCreditAndTotalResult {
  const updatedLedgerAccounts = ledgerAccounts.map((ledgerAccount) => {
    if (ledgerAccount.assetId !== asset) {
      return ledgerAccount;
    }
    const newAmount = BigNumber(ledgerAccount.assetAmount).minus(
      withdrawalAmount,
    );

    return {
      ...ledgerAccount,
      assetAmount: newAmount,
      accountValue: newAmount
        .multipliedBy(ledgerAccount.assetPrice)
        .decimalPlaces(2, BigNumber.ROUND_DOWN)
        .toString(),
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
