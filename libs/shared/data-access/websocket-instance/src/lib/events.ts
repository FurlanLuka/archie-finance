// Circular dep :(
// import { LedgerAccountData } from '@archie-webapps/shared/data-access/archie-api/ledger/ledger.interfaces';

export enum WsEventTopic {
  ONBOARDING_UPDATED_TOPIC = 'onboarding.onboarding.updated.v1',
  LTV_UPDATED_TOPIC = 'ltv.ltv.updated.v1',
  LEDGER_UPDATED_TOPIC = 'ledger.account.updated.v1',
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

export interface LedgerAccountDataWs {
  assetId: string;
  assetAmount: string;
  accountValue: string;
  calculatedAt: string;
}

interface LiquidationLedgerAccountAction {
  type: LedgerActionType.LIQUIDATION;
  liquidation: {
    id: string;
    usdAmount: string;
  };
}

interface OtherLedgerAccountAction {
  type: Exclude<LedgerActionType, LedgerActionType.LIQUIDATION>;
}

export type LedgerAccountAction = LiquidationLedgerAccountAction | OtherLedgerAccountAction;
// TODO use the above import sometime in the future
export interface LedgerAccountUpdatedPayload {
  userId: string;
  ledgerAccounts: LedgerAccountDataWs[];
  action: LedgerAccountAction;
}

export enum LedgerActionType {
  DEPOSIT = 'DEPOSIT',
  WITHDRAWAL = 'WITHDRAWAL',
  LIQUIDATION = 'LIQUIDATION',
  ASSET_PRICE_UPDATE = 'ASSET_PRICE_UPDATE',
  FEE = 'FEE',
  WITHDRAWAL_FAILURE = 'WITHDRAWAL_FAILURE',
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

export type WsEvent = OnboardingUpdatedWsEvent | LtvUpdatedWsEvent;
