import { useExtendedMutation } from '../../helper-hooks';
import { MutationQueryResponse } from '../../interface';
import { completeAptoVerification, CompleteAptoVerificationPayload } from '../api/complete-apto-verification';

export const useCompleteAptoVerification = (): MutationQueryResponse => {
  return useExtendedMutation<unknown, CompleteAptoVerificationPayload>(
    'apto_verification_complete',
    completeAptoVerification,
  );
};
