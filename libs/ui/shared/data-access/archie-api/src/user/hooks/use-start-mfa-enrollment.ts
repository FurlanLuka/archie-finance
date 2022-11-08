import { SendEnrollmentTicketResponse } from '@archie/api/user-api/data-transfer-objects/types';

import { useExtendedMutation } from '../../helper-hooks';
import { MutationQueryResponse } from '../../interface';
import { createMfaEnrollment } from '../api/create-mfa-enrollment';

export const useStartMfaEnrollment = (): MutationQueryResponse<
  unknown,
  SendEnrollmentTicketResponse
> => {
  return useExtendedMutation('start_mfa_enrollment', createMfaEnrollment);
};
