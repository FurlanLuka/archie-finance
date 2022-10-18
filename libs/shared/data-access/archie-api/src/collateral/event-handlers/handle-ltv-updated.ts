import { queryClient } from '@archie-webapps/shared/data-access/query-client';
import { LtvUpdatedWsEvent } from '@archie-webapps/shared/data-access/websocket-instance';

import { LTV } from '../api/get-ltv';
import { LTV_RECORD_QUERY_KEY } from '../hooks/use-get-ltv';

export const handleLtvUpdatedEvent = (event: LtvUpdatedWsEvent): void => {
  queryClient.setQueryData<LTV | undefined>(LTV_RECORD_QUERY_KEY, (data): LTV | undefined => {
    if (data !== undefined) {
      return {
        ...data,
        ltv: event.data.ltv,
      };
    }
    return undefined;
  });
};
