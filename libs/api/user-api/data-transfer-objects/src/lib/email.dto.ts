export class EmailVerifiedPayload {
  userId: string;
  email: string;
}

export class GetEmailVerificationResponse {
  isVerified: boolean;
  email: string;
}

export class GetEmailAddressResponse {
  email: string;
}

export class GetEmailAddressPayload {
  userId: string;
}
