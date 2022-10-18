import { useEffect } from 'react';

import {
  websocketInstance,
  WsEventTopic,
} from '@archie-microservices/ui/shared/data-access/websocket-instance';

import { useExtendedQuery } from '../../helper-hooks';
import { QueryResponse } from '../../interface';
import { getOnboarding, GetOnboardingResponse } from '../api/get-onboarding';
import { handleOnboardingUpdatedEvent } from '../event-handlers/handle-onboarding-updated';

export const ONBOARDING_RECORD_QUERY_KEY = 'onboarding_record';
const ONBOARDING_UPDATED_HANDLER_ID = 'useGetOnboarding.onboarding-updated';

export const useGetOnboarding = (
  enabled = true,
): QueryResponse<GetOnboardingResponse> => {
  useEffect(() => {
    websocketInstance.addHandler(
      WsEventTopic.ONBOARDING_UPDATED_TOPIC,
      ONBOARDING_UPDATED_HANDLER_ID,
      handleOnboardingUpdatedEvent,
    );
  }, []);

  return useExtendedQuery(
    ONBOARDING_RECORD_QUERY_KEY,
    async (accessToken: string) => getOnboarding(accessToken),
    {
      enabled,
    },
  );
};
