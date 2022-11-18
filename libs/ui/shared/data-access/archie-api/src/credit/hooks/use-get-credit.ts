import { useEffect } from 'react';

import { LoanBalances } from '@archie/api/peach-api/data-transfer-objects/types';
import {
  websocketInstance,
  WsEventTopic,
} from '@archie/ui/shared/data-access/websocket-instance';

import { useExtendedQuery } from '../../helper-hooks';
import { QueryResponse } from '../../interface';
import { getCredit } from '../api/get-credit';
import { handleCreditBalanceUpdatedEvent } from '../event-handlers/handle-credit-balance-updated';

export const CREDIT_RECORD_QUERY_KEY = ['credit_record'];
const CREDIT_BALANCE_UPDATED_HANDLER_ID = 'useGetLTV.ltv-updated';

export const useGetCredit = (): QueryResponse<LoanBalances> => {
  useEffect(() => {
    websocketInstance.addHandler(
      WsEventTopic.CREDIT_BALANCE_UPDATED_TOPIC,
      CREDIT_BALANCE_UPDATED_HANDLER_ID,
      handleCreditBalanceUpdatedEvent,
    );
  }, []);

  return useExtendedQuery(
    CREDIT_RECORD_QUERY_KEY,
    async (accessToken: string) => getCredit(accessToken),
  );
};
