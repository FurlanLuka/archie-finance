import { useExtendedMutation } from '@archie/api-consumer/helper-hooks';
import { DefaultVariables } from '@archie/api-consumer/helpers';
import { MutationQueryResponse } from '@archie/api-consumer/interface';
import { resendEmailVerification } from '../api/resend-email-verification';

export const useResendEmailVerification = (): MutationQueryResponse<
  DefaultVariables,
  void
> => {
  return useExtendedMutation(
    'resend_email_verification',
    resendEmailVerification,
  );
};
