import { QueryClient, useQueryClient } from 'react-query';

import { useExtendedQuery } from '../../helper-hooks';
import { QueryResponse } from '../../interface';
import { ONBOARDING_RECORD_QUERY_KEY } from '../../onboarding/hooks/use-get-onboarding';
import { getEmailVerification, GetEmailVerificationResponse } from '../api/get-email-verification';



export const EMAIL_VERIFICATION_QUERY_KEY = 'email_verification_record';

export const usePollEmailVerification = (): QueryResponse<GetEmailVerificationResponse> => {
  const queryClient: QueryClient = useQueryClient();

  return useExtendedQuery(
    EMAIL_VERIFICATION_QUERY_KEY,
    async (accessToken: string) => getEmailVerification(accessToken),
    {
      refetchInterval: (data) => {
        if (data?.isVerified) {
          return false;
        }

        return 10000;
      },
      onSuccess: (data) => {
        if (data.isVerified) {
          queryClient.invalidateQueries(ONBOARDING_RECORD_QUERY_KEY);
        }
      },
    },
  );
};
