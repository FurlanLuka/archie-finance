import { useEffect } from 'react';

import { websocketInstance, WsEventTopic } from '@archie-webapps/shared/data-access/websocket-instance';

import { useExtendedQuery } from '../../helper-hooks';
import { QueryResponse } from '../../interface';
import { getLTV, LTV } from '../api/get-ltv';
import { handleLtvUpdatedEvent } from '../event-handlers/handle-ltv-updated';

export const LTV_RECORD_QUERY_KEY = 'ltv_record';

export const useGetLTV = (): QueryResponse<LTV> => {
  useEffect(() => {
    websocketInstance.addHandler(WsEventTopic.LTV_UPDATED_TOPIC, handleLtvUpdatedEvent);
  }, []);

  return useExtendedQuery(LTV_RECORD_QUERY_KEY, async (accessToken: string) => getLTV(accessToken));
};
