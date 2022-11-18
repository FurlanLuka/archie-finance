import { QueryClient, useQueryClient } from '@tanstack/react-query';

import { EmailVerification } from '@archie/api/user-api/data-transfer-objects/types';

import { useExtendedQuery } from '../../helper-hooks';
import { QueryResponse } from '../../interface';
import { ONBOARDING_RECORD_QUERY_KEY } from '../../onboarding/hooks/use-get-onboarding';
import { getEmailVerification } from '../api/get-email-verification';

export const EMAIL_VERIFICATION_RECORD_QUERY_KEY = [
  'email_verification_record',
];

export const usePollEmailVerification =
  (): QueryResponse<EmailVerification> => {
    const queryClient: QueryClient = useQueryClient();

    return useExtendedQuery(
      EMAIL_VERIFICATION_RECORD_QUERY_KEY,
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
            queryClient.invalidateQueries({
              queryKey: ONBOARDING_RECORD_QUERY_KEY,
            });
          }
        },
      },
    );
  };
