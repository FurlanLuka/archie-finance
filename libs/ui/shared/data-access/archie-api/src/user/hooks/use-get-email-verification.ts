import { EmailVerification } from '@archie/api/user-api/data-transfer-objects/types';

import { useExtendedQuery } from '../../helper-hooks';
import { QueryResponse } from '../../interface';
import { getEmailVerification } from '../api/get-email-verification';

export const EMAIL_VERIFICATION_RECORD_QUERY_KEY = 'email_verification_record';

export const useGetEmailVerification = (): QueryResponse<EmailVerification> => {
  return useExtendedQuery(
    EMAIL_VERIFICATION_RECORD_QUERY_KEY,
    async (accessToken: string) => getEmailVerification(accessToken),
  );
};
