import { QueryResponse } from '../../interface';
import { getOnboarding, GetOnboardingResponse } from '../api/get-onboarding';
import { useExtendedQuery } from '@archie/api-consumer/helper-hooks';

export const ONBOARDING_RECORD_QUERY_KEY = 'onboarding_record';

export const useGetOnboarding = (enabled = true): QueryResponse<GetOnboardingResponse> => {
  return useExtendedQuery(ONBOARDING_RECORD_QUERY_KEY, async (accessToken: string) => getOnboarding(accessToken), {
    enabled,
  });
};
