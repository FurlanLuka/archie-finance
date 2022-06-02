export interface StartPhoneVerificationResponse {
  verificationId: string;
  status: string;
}

export interface CompletePhoneVerificationResponse {
  verificationId: string;
  status: string;
}

export enum AptoCardApplicationNextAction {
  SHOW_CARDHOLDER_AGREEMENT = 'show_cardholder_agreement',
}
