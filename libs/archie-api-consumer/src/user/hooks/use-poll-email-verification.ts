import { QueryResponse } from '../../interface';
import { useExtendedQuery } from '../../helper-hooks';
import { getEmailVerification, GetEmailVerificationResponse } from '../api/get-email-verification';
import { QueryClient, useQueryClient } from 'react-query';
import { ONBOARDING_RECORD_QUERY_KEY } from '../../onboarding/hooks/use-get-onboarding';

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

        return 1000;
      },
      onSuccess: (data) => {
        if (data.isVerified) {
          queryClient.invalidateQueries(ONBOARDING_RECORD_QUERY_KEY);
        }
      },
    },
  );
};
