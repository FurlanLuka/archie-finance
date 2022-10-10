import { useEffect, useState } from 'react';

import { RequestState } from '@archie-webapps/shared/data-access/archie-api/interface';
import { Ledger } from '@archie-webapps/shared/data-access/archie-api/ledger/api/get-ledger';
import { usePollLedger } from '@archie-webapps/shared/data-access/archie-api/ledger/hooks/use-poll-ledger';

interface UsePollLedgerChangesParams {
  initialLedger: Ledger;
  onLedgerChange: () => void;
}

interface UsePollLedgerChangesResult {
  currentLedger: Ledger;
  startPolling: VoidFunction;
}

const areLedgerAccountsEqual = (currentLedger: Ledger, updatedLedger: Ledger) => {
  if (currentLedger.accounts.length !== updatedLedger.accounts.length) {
    return false;
  }

  return currentLedger.accounts.every((ledgerAccount) => {
    const matchingLedgerAccount = updatedLedger.accounts.find(
      (updatedLedgerAccount) => updatedLedgerAccount.assetId === ledgerAccount.assetId,
    );

    if (!matchingLedgerAccount) {
      return false;
    }

    return ledgerAccount.assetAmount === matchingLedgerAccount.assetAmount;
  });
};

export const usePollLedgerChanges = ({
  onLedgerChange,
  initialLedger,
}: UsePollLedgerChangesParams): UsePollLedgerChangesResult => {
  const [shouldPoll, setShouldPoll] = useState(true);
  const [currentLedger, setCurrentLedger] = useState<Ledger>(initialLedger);

  const getLedgerResponse = usePollLedger(shouldPoll);

  useEffect(() => {
    // if we're not polling don't check
    // (same query key is used)
    if (!shouldPoll) {
      return;
    }

    if (getLedgerResponse.state === RequestState.SUCCESS) {
      const updatedLedger = getLedgerResponse.data;

      if (!areLedgerAccountsEqual(currentLedger, updatedLedger)) {
        setShouldPoll(false);
        onLedgerChange();
      }

      // always update collateral in case the price changed
      setCurrentLedger(updatedLedger);
    }
  }, [shouldPoll, getLedgerResponse, onLedgerChange, currentLedger]);

  const startPolling = () => setShouldPoll(true);

  return { currentLedger, startPolling };
};
