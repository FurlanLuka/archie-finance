import { queryClient } from '@archie-webapps/shared/data-access/query-client';
import { OnboardingUpdatedWsEvent } from '@archie-webapps/shared/data-access/websocket-instance';

import { GetOnboardingResponse } from '../api/get-onboarding';
import { ONBOARDING_RECORD_QUERY_KEY } from '../hooks/use-get-onboarding';

export const handleOnboardingUpdatedEvent = (
  event: OnboardingUpdatedWsEvent,
): void => {
  queryClient.setQueryData<GetOnboardingResponse>(
    ONBOARDING_RECORD_QUERY_KEY,
    event.data,
  );
};
