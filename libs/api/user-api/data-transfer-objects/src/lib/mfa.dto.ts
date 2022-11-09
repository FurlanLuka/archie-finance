import { AuthMethod, EnrollmentStatus } from 'auth0';
import {
  EmailAddress,
  EmailVerification,
  Enrollment,
  MfaEnrollment,
  SendEnrollmentTicketResponse,
} from './user.interfaces';
import { IsEnum, IsOptional } from 'class-validator';

export class MfaEnrolledPayload {
  userId: string;
}

export class MfaRemovedPayload {
  userId: string;
}

export class GetEnrollmentResponse implements Enrollment {
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

export class GetSendEnrollmentTicketResponseDto
  implements SendEnrollmentTicketResponse
{
  ticket_id: string;
  ticket_url: string;
}
export class GetMfaEnrollmentResponse {
  isEnrolled: boolean;
}

export class GetSendEnrollmentTicketResponse
  implements SendEnrollmentTicketResponse
{
  ticket_id: string;
  ticket_url: string;
}

export enum EnrollmentType {
  authenticator = 'authenticator',
}
export enum EnrollmentStatusQuery {
  pending = 'pending',
  confirmed = 'confirmed',
}

export class GetEnrollmentsQuery {
  @IsEnum(EnrollmentStatusQuery)
  @IsOptional()
  status: EnrollmentStatus | null = null;

  @IsEnum(EnrollmentType)
  @IsOptional()
  type: EnrollmentType | null = null;
}
