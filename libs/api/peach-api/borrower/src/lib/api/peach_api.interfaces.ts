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
      fromInstrument: {
        paymentNetworkName: string;
        accountNumberLastFour?: string;
      };
    };
    actualAmount: number;
    currency: string;
    failureDescriptionShort: string | null;
    failureDescriptionLong: string | null;
    autopayPlanId: string | null;
    cancelReason: string | null;
  }[];
}

export enum PurchaseType {
  regular = 'regular',
  refund = 'refund',
  cashBack = 'cashBack',
}

export enum PurchaseStatus {
  settled = 'settled',
  pending = 'pending',
  canceled = 'canceled',
  declined = 'declined',
  disputed = 'disputed',
}

export enum PurchaseTransactionType {
  atm_withdrawal = 'atm_withdrawal',
  card_purchase = 'card_purchase',
  card_refund = 'card_refund',
  dispute = 'dispute',
  external_transfer = 'external_transfer',
  fee = 'fee',
  credit = 'credit',
  internal_transfer = 'internal_transfer',
  other = 'other',
  reversed_transfer = 'reversed_transfer',
  third_party_transfer = 'third_party_transfer',
}

export interface Purchases extends PeachResponse {
  total: number;
  count: number;
  nextUrl: string | null;
  previousUrl: string | null;
  data: {
    id: string;
    amount: number;
    declineReason: string | null;
    purchaseDate: string;
    purchaseDetails: {
      categoryId: string | null;
      conversionRate: number;
      description: string;
      externalCardId: string;
      isValidMerchantId: boolean;
      merchantCategoryCode: string;
      merchantCity: string;
      merchantCountry: string | null;
      merchantId: string;
      merchantName: string;
      merchantState: string | null;
      metadata: {
        transactionType: PurchaseTransactionType;
      } | null;
      originalCurrencyAmount: number | null;
      originalCurrencyCode: string | null;
      pointOfSaleType: string | null;
    };
    status: PurchaseStatus;
    timestamps: {
      createdAt: string;
      effectiveAt: string | null;
      updatedAt: string | null;
    };
    type: PurchaseType;
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

export interface Obligations {
  daysOverdue: number;
  isLocked: boolean;
  isOverdue: boolean;
  overdueAmount: number;
  obligations: Obligation[];
}

export interface Balances {
  isLocked: boolean;
  availableCreditAmount: number;
  creditLimitAmount: number;
  calculatedAt: string;
  outstandingBalances: {
    outstandingFeesAmount: number;
    outstandingInterestAmount: number;
    outstandingPrincipalAmount: number;
    outstandingTotalAmount: number;
  };
  overdueBalances: {
    overdueFeesAmount: number;
    overdueInterestAmount: number;
    overduePrincipalAmount: number;
    overdueTotalAmount: number;
  };
  dueBalances: {
    dueFeesAmount: number;
    dueInterestAmount: number;
    duePrincipalAmount: number;
    dueTotalAmount: number;
  };
  utilizationAmount: number;
}

export interface Credit {
  availableCreditAmount: number;
  creditLimitAmount: number;
  calculatedAt: string;
  utilizationAmount: number;
}

export interface PeachErrorResponse {
  config: object;
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
