import { useEffect } from 'react';

import { Ledger } from '@archie-webapps/shared/data-access/archie-api-dtos';
import { websocketInstance, WsEventTopic } from '@archie-webapps/shared/data-access/websocket-instance';

import { useExtendedQuery } from '../../helper-hooks';
import { QueryResponse } from '../../interface';
import { getLedger } from '../api/get-ledger';
import { handleLedgerUpdatedEvent } from '../event-handlers/handle-ledger-updated';

export const LEDGER_QUERY_KEY = 'ledger';
const LEDGER_UPDATED_HANDLER_ID = 'useGetLedger.ledger-updated';

export const useGetLedger = (): QueryResponse<Ledger> => {
  useEffect(() => {
    websocketInstance.addHandler(
      WsEventTopic.LEDGER_UPDATED_TOPIC,
      LEDGER_UPDATED_HANDLER_ID,
      handleLedgerUpdatedEvent,
    );
  }, []);

  return useExtendedQuery(LEDGER_QUERY_KEY, async (accessToken: string) => getLedger(accessToken));
};
