export enum WsEventTopic {
  ONBOARDING_UPDATED_TOPIC = 'onboarding.onboarding.updated.v1',
  LTV_UPDATED_TOPIC = 'ltv.ltv.updated.v1',
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

export interface LtvUpdatedPayload {
  userId: string;
  ltv: number;
}

export interface OnboardingUpdatedWsEvent {
  topic: WsEventTopic.ONBOARDING_UPDATED_TOPIC;
  data: OnboardingUpdatedPayload;
}

export interface LtvUpdatedWsEvent {
  topic: WsEventTopic.LTV_UPDATED_TOPIC;
  data: LtvUpdatedPayload;
}

export type WsEvent = OnboardingUpdatedWsEvent | LtvUpdatedWsEvent;
