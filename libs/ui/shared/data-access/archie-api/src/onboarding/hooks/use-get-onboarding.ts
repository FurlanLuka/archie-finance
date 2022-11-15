import { useEffect } from 'react';

import { Onboarding } from '@archie/api/onboarding-api/data-transfer-objects/types';
import {
  websocketInstance,
  WsEventTopic,
} from '@archie/ui/shared/data-access/websocket-instance';

import { useExtendedQuery } from '../../helper-hooks';
import { QueryResponse } from '../../interface';
import { getOnboarding } from '../api/get-onboarding';
import { handleOnboardingUpdatedEvent } from '../event-handlers/handle-onboarding-updated';

export const ONBOARDING_RECORD_QUERY_KEY = ['onboarding_record'];
const ONBOARDING_UPDATED_HANDLER_ID = 'useGetOnboarding.onboarding-updated';

export const useGetOnboarding = (): QueryResponse<Onboarding> => {
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
  );
};
