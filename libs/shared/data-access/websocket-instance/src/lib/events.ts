export enum WsEventTopic {
  ONBOARDING_UPDATED_TOPIC = 'onboarding.onboarding.updated',
  LTV_UPDATED_TOPIC = 'ltv.ltv.updated',
}

export interface OnboardingUpdatedPayload {
  userId: string;
  kycStage: boolean;
  emailVerificationStage: boolean;
  collateralizationStage: boolean;
  cardActivationStage: boolean;
  mfaEnrollmentStage: boolean;
  completed: boolean;
}

export interface OnboardingUpdatedWsEvent {
  topic: WsEventTopic.ONBOARDING_UPDATED_TOPIC;
  data: OnboardingUpdatedPayload;
}

export type WsEvent = OnboardingUpdatedWsEvent;
