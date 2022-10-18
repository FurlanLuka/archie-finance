import { useExtendedQuery } from '../../helper-hooks';
import { QueryResponse } from '../../interface';
import { getEmailVerification, EmailVerificationResponse } from '../api/get-email-verification';

export const EMAIL_VERIFICATION_RECORD_QUERY_KEY = 'email_verification_record';

export const useGetEmailVerification = (): QueryResponse<EmailVerificationResponse> => {
  return useExtendedQuery(EMAIL_VERIFICATION_RECORD_QUERY_KEY, async (accessToken: string) =>
    getEmailVerification(accessToken),
  );
};
