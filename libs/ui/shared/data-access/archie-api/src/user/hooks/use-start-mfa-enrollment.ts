import { SendEnrollmentTicketResponse } from '@archie/api/user-api/data-transfer-objects/types';

import { useExtendedMutation } from '../../helper-hooks';
import { DefaultVariables } from '../../helpers';
import { MutationQueryResponse } from '../../interface';
import { createMfaEnrollment } from '../api/create-mfa-enrollment';

export const useStartMfaEnrollment = (): MutationQueryResponse<
  SendEnrollmentTicketResponse,
  DefaultVariables
> => {
  return useExtendedMutation<SendEnrollmentTicketResponse, DefaultVariables>(
    ['start_mfa_enrollment'],
    createMfaEnrollment,
  );
};
