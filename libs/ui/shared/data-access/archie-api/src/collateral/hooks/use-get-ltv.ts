import { useEffect } from 'react';

import { Ltv } from '@archie/api/ltv-api/data-transfer-objects/types';
import {
  websocketInstance,
  WsEventTopic,
} from '@archie/ui/shared/data-access/websocket-instance';

import { useExtendedQuery } from '../../helper-hooks';
import { QueryResponse } from '../../interface';
import { getLTV } from '../api/get-ltv';
import { handleLtvUpdatedEvent } from '../event-handlers/handle-ltv-updated';

export const LTV_RECORD_QUERY_KEY = ['ltv_record'];
const LTV_UPDATED_HANDLER_ID = 'useGetLTV.ltv-updated';

export const useGetLTV = (): QueryResponse<Ltv> => {
  useEffect(() => {
    websocketInstance.addHandler(
      WsEventTopic.LTV_UPDATED_TOPIC,
      LTV_UPDATED_HANDLER_ID,
      handleLtvUpdatedEvent,
    );
  }, []);

  return useExtendedQuery(LTV_RECORD_QUERY_KEY, async (accessToken: string) =>
    getLTV(accessToken),
  );
};
