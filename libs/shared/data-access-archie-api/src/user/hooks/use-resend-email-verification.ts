import { useExtendedMutation } from '../../helper-hooks';
import { DefaultVariables } from '../../helpers';
import { MutationQueryResponse } from '../../interface';
import { resendEmailVerification } from '../api/resend-email-verification';

export const useResendEmailVerification = (): MutationQueryResponse<DefaultVariables, void> => {
  return useExtendedMutation('resend_email_verification', resendEmailVerification);
};
