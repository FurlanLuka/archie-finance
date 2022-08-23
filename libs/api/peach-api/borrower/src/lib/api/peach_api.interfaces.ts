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

export enum PaymentStatus {
  scheduled = 'scheduled',
  initiated = 'initiated',
  pending = 'pending',
  succeeded = 'succeeded',
  failed = 'failed',
  inDispute = 'inDispute',
  canceled = 'canceled',
  chargeback = 'chargeback',
}

export enum TransactionType {
  payment = 'payment',
  serviceCredit = 'serviceCredit',
}

export enum PaymentType {
  ach = 'ach',
  debitCard = 'debitCard',
  creditCard = 'creditCard',
  check = 'check',
  cash = 'cash',
  payroll = 'payroll',
  paymentNetwork = 'paymentNetwork',
}

export enum PaymentReason {
  autoPay = 'autoPay',
  oneTimePay = 'oneTimePay',
  settlement = 'settlement',
  reversal = 'reversal',
  reimbursement = 'reimbursement',
}

export interface QueryParams {
  startingAfter?: string | null;
  endingBefore?: string | null;
  limit: number;
  fromEffectiveDate?: string | null;
  toEffectiveDate?: string | null;
}

export interface Payments extends PeachResponse {
  total: number;
  count: number;
  nextUrl: string | null;
  previousUrl: string | null;
  data: {
    id: string;
    timestamps: {
      appliedAt: string;
      canceledAt: string | null;
      chargebackAt: string | null;
      createdAt: string;
      deletedAt: string | null;
      displayDate: string;
      effectiveDate: string;
      failedAt: string | null;
      inDisputeAt: string | null;
      initiatedAt: string;
      originalEffectiveDate: string;
      pendingAt: string;
      scheduledDate: string;
      succeededAt: string | null;
      updatedAt: string | null;
    };
    isExternal: boolean;
    isVirtual: boolean;
    status: PaymentStatus;
    transactionType: TransactionType;
    paymentDetails: {
      type: PaymentType;
      reason: PaymentReason;
      fromInstrumentId: string;
    };
    actualAmount: number;
    currency: string;
    failureDescriptionShort?: string;
    failureDescriptionLong?: string;
    autopayPlanId?: string;
    cancelReason?: string;
  }[];
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
