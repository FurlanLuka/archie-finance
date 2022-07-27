export interface GetEmailVerificationResponse {
  isVerified: boolean;
  email: string;
}

export interface GetMfaEnrollmentResponse {
  isEnrolled: boolean;
}
