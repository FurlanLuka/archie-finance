import {
  AuthMethod,
  Enrollment,
  EnrollmentStatus,
  SendEnrollmentTicketResponse,
} from 'auth0';

export class GetEmailAddressResponse {
  email: string;
}

export class GetSendEnrollmentTicketResponse
  implements SendEnrollmentTicketResponse
{
  ticket_id: string;
  ticket_url: string;
}

export class GetEnrollmentResponse implements Enrollment {
  id: string;
  status: EnrollmentStatus;
  enrolled_at: string;
  last_auth: string;
  type: string;
  auth_method: AuthMethod;
}

export class GetEmailVerificationResponse {
  isVerified: boolean;
  email: string;
}

export class GetMfaEnrollmentResponse {
  isEnrolled: boolean;
}

export class GetEmailAddressPayload {
  userId: string;
}
