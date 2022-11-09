import { Onboarding } from '@archie/api/onboarding-api/data-transfer-objects/types';
import { queryClient } from '@archie/ui/shared/data-access/query-client';
import { OnboardingUpdatedWsEvent } from '@archie/ui/shared/data-access/websocket-instance';

import { ONBOARDING_RECORD_QUERY_KEY } from '../hooks/use-get-onboarding';

export const handleOnboardingUpdatedEvent = (
  event: OnboardingUpdatedWsEvent,
): void => {
  queryClient.setQueryData<Onboarding>(ONBOARDING_RECORD_QUERY_KEY, event.data);
};
