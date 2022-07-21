import {
  GetEmailVerificationResponse,
  GetMfaEnrollmentResponse,
} from './user.interfaces';
import { GetEmailAddressResponse } from '@archie/api/utils/interfaces/user';
import {
  AuthMethod,
  Enrollment,
  EnrollmentStatus,
  SendEnrollmentTicketResponse,
} from 'auth0';

export class GetEmailVerificationResponseDto
  implements GetEmailVerificationResponse
{
  isVerified: boolean;
}

export class GetEmailAddressResponseDto implements GetEmailAddressResponse {
  email: string;
}

export class GetMfaEnrollmentResponseDto implements GetMfaEnrollmentResponse {
  isEnrolled: boolean;
}

export class GetSendEnrollmentTicketResponseDto
  implements SendEnrollmentTicketResponse
{
  ticket_id: string;
  ticket_url: string;
}

export class EnrollmentDto implements Enrollment {
  id: string;
  status: EnrollmentStatus;
  enrolled_at: string;
  last_auth: string;
  type: string;
  auth_method: AuthMethod;
}
