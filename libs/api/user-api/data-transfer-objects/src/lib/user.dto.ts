import { AuthMethod, EnrollmentStatus } from 'auth0';
import {
  EmailAddress,
  EmailVerification,
  Enrollment,
  MfaEnrollment,
  SendEnrollmentTicketResponse,
} from './user.interfaces';

export class EnrollmentDto implements Enrollment {
  id: string;
  status: EnrollmentStatus;
  enrolled_at: string;
  last_auth: string;
  type: string;
  auth_method: AuthMethod;
}

export class EmailVerificationDto implements EmailVerification {
  isVerified: boolean;
  email: string;
}

export class MfaEnrollmentDto implements MfaEnrollment {
  isEnrolled: boolean;
}

export class EmailAddressDto implements EmailAddress {
  email: string;
}

export class GetSendEnrollmentTicketResponseDto implements SendEnrollmentTicketResponse {
  ticket_id: string;
  ticket_url: string;
}
