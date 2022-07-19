import { QueryClient, useQueryClient } from 'react-query';

import { useExtendedQuery } from '../../helper-hooks';
import { QueryResponse } from '../../interface';
import { ONBOARDING_RECORD_QUERY_KEY } from '../../onboarding/hooks/use-get-onboarding';
import { getMfaEnrollment, GetMfaEnrollmentResponse } from '../api/get-mfa-enrollment';

export const MFA_ENROLLMENT_QUERY_KEY = 'mfa_enrollment';

export const usePollMfaEnrollment = (isEnabled: boolean): QueryResponse<GetMfaEnrollmentResponse> => {
  const queryClient: QueryClient = useQueryClient();

  return useExtendedQuery(MFA_ENROLLMENT_QUERY_KEY, async (accessToken: string) => getMfaEnrollment(accessToken), {
    refetchInterval: (data) => {
      if (data?.isEnrolled) {
        return false;
      }

      return 10000;
    },
    onSuccess: (data) => {
      if (data.isEnrolled) {
        queryClient.invalidateQueries(ONBOARDING_RECORD_QUERY_KEY);
      }
    },
    enabled: isEnabled,
  });
};
