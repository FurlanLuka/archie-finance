import {
  Enrollment as Auth0Enrollment,
  SendEnrollmentTicketResponse as Auth0SendEnrollmentTicketResponse,
} from 'auth0';

export interface MfaEnrolledPayload {
  userId: string;
}

export interface MfaRemovedPayload {
  userId: string;
}

export interface EmailVerifiedPayload {
  userId: string;
  email: string;
}

export interface EmailVerification {
  isVerified: boolean;
  email: string;
}

export interface MfaEnrollment {
  isEnrolled: boolean;
}

export interface EmailAddress {
  email: string;
}

export interface GetEmailAddressPayload {
  userId: string;
}

export type Enrollment = Auth0Enrollment;
export type SendEnrollmentTicketResponse = Auth0SendEnrollmentTicketResponse;
