import { Ltv } from '@archie/api/ltv-api/data-transfer-objects/types';
import { queryClient } from '@archie/ui/shared/data-access/query-client';
import { LtvUpdatedWsEvent } from '@archie/ui/shared/data-access/websocket-instance';

import { LTV_RECORD_QUERY_KEY } from '../hooks/use-get-ltv';

export const handleLtvUpdatedEvent = (event: LtvUpdatedWsEvent): void => {
  queryClient.setQueryData<Ltv | undefined>(
    LTV_RECORD_QUERY_KEY,
    (data): Ltv | undefined => {
      if (data !== undefined) {
        return {
          ...data,
          ltv: event.data.ltv,
        };
      }
      return undefined;
    },
  );
};
