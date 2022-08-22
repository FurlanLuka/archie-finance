import { AxiosRequestConfig } from 'axios';

export enum PersonStatus {
  active = 'active',
  inactive = 'inactive',
}

export enum IdentityType {
  SSN = 'SSN',
  ITIN = 'ITIN',
  passport = 'passport',
  driversLicense = 'driversLicense',
  taxID = 'taxID',
  FEIN = 'FEIN',
}

export type PeachResponse = Record<string, unknown>;

export interface Person extends PeachResponse {
  id: string;
  companyId: string;
}

export interface PaymentInstrument extends PeachResponse {
  id: string;
  nickname: string;
  accountNumberLastFour: string;
  accountType: string;
}

export interface PaymentInstrumentBalance extends PeachResponse {
  id: string;
  availableBalanceAmount: number;
  lastSuccessfulBalance: {
    availableBalanceAmount: number;
    currency: string;
  };
}

export interface Document extends PeachResponse {
  id: string;
}

export interface HomeAddress extends PeachResponse {
  id: string;
}

export interface CreditLine extends PeachResponse {
  id: string;
}

export interface Draw extends PeachResponse {
  id: string;
}

export interface CreditLimit extends PeachResponse {
  creditLimitAmount: number;
}

export interface Obligation extends PeachResponse {
  capitalizedAmount: number;
  createdAt: string;
  deletedAt: string | null;
  dueDate: string;
  fulfilledAmount: number;
  gracePeriod: string | null;
  id: string;
  isFulfilled: boolean;
  isOpen: boolean;
  isOverdue: boolean;
  obligationAmount: number;
  overpaymentsAmount: number;
  periodId: string;
  remainingAmount: number;
  updatedAt: string | null;
}

export interface ObligationsResponse {
  daysOverdue: number;
  isLocked: boolean;
  isOverdue: boolean;
  overdueAmount: number;
  obligations: Obligation[];
}

export interface Credit {
  availableCreditAmount: number;
  creditLimitAmount: number;
  calculatedAt: string;
}

export interface PeachErrorResponse {
  config: AxiosRequestConfig;
  status: number;
  errorResponse: PeachErrorData;
}

export interface PeachErrorData {
  message: string;
  status: number;
}

export enum PeachTransactionType {
  atm_withdrawal = 'regular',
  card_purchase = 'regular',
  card_refund = 'refund',
  dispute = 'cashBack',
  external_transfer = '',
  fee = '',
  credit = '',
  internal_transfer = 'regular',
  other = 'regular',
  reversed_transfer = '',
  third_party_transfer = '',
}

export enum PeachTransactionStatus {
  queued = 'pending',
  pending = 'pending',
  settled = 'settled',
  failed = 'canceled',
}

export enum AmountType {
  statementMinimumAmount = 'statementMinimumAmount',
  statementMinimumAmountPlusExtra = 'statementMinimumAmountPlusExtra',
  statementBalanceAmount = 'statementBalanceAmount',
}

export interface AutopayOptions {
  amountType: AmountType;
  extraAmount?: number | null;
  paymentInstrumentId: string;
  isAlignedToDueDates: boolean;
  offsetFromDueDate?: number[] | null;
  agreementDocumentId: string;
}

export enum PaymentFrequency {
  twiceMonthly = 'twiceMonthly',
  everyTwoWeeks = 'everyTwoWeeks',
  monthly = 'monthly',
}

export enum AutopayScheduleStatus {
  booked = 'booked',
  modified = 'modified',
  canceled = 'canceled',
  processed = 'processed',
}

export interface Autopay extends PeachResponse {
  agreementDocumentId: string;
  type: AmountType;
  extraAmount: number;
  isAlignedToDueDates: boolean;
  paymentFrequency: PaymentFrequency;
  specificDays: number[];
  paymentInstrumentId: string;
  cancelReason: string;
  schedule: AutopaySchedule[];
}

export interface AutopaySchedule {
  date: string;
  periodId: string;
  paymentType: string;
  status: string;
  amount: number;
  originalAmount: number;
  principalAmount: number;
  interestAmount: number;
  interestBeforeDiscountAmount: number;
  isDeferred: boolean;
}
