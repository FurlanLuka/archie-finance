import { LedgerAccountUpdatedPayload } from '@archie/api/ledger-api/data-transfer-objects/types';
import { LtvUpdatedPayload } from '@archie/api/ltv-api/data-transfer-objects/types';
import { OnboardingUpdatedPayload } from '@archie/api/onboarding-api/data-transfer-objects/types';
import { CreditBalanceUpdatedPayload } from '@archie/api/peach-api/data-transfer-objects/types';

// TODO use BE topics when https://github.com/microsoft/TypeScript/pull/50528 is merged
export enum WsEventTopic {
  ONBOARDING_UPDATED_TOPIC = 'onboarding.onboarding.updated.v1',
  LTV_UPDATED_TOPIC = 'ltv.ltv.updated.v1',
  LEDGER_UPDATED_TOPIC = 'ledger.account.updated.v1',
  CREDIT_BALANCE_UPDATED_TOPIC = 'peach.credit_balance.updated.v1',
}

export interface OnboardingUpdatedWsEvent {
  topic: WsEventTopic.ONBOARDING_UPDATED_TOPIC;
  data: OnboardingUpdatedPayload;
}

export interface LtvUpdatedWsEvent {
  topic: WsEventTopic.LTV_UPDATED_TOPIC;
  data: LtvUpdatedPayload;
}

export interface LedgerUpdatedWsEvent {
  topic: WsEventTopic.LEDGER_UPDATED_TOPIC;
  data: LedgerAccountUpdatedPayload;
}

export interface CreditBalanceUpdatedWsEvent {
  topic: WsEventTopic.CREDIT_BALANCE_UPDATED_TOPIC;
  data: CreditBalanceUpdatedPayload;
}

export type WsEvent =
  | OnboardingUpdatedWsEvent
  | LtvUpdatedWsEvent
  | LedgerUpdatedWsEvent;
