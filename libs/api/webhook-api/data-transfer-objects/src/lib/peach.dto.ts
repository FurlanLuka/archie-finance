export enum PeachTransactionStatus {
  queued = 'pending',
  pending = 'pending',
  settled = 'settled',
  failed = 'canceled',
}

// Not all properties are included in the interface - check payload if something is missing
export interface Borrower {
  externalId: string;
}

// Not all properties are included in the interface - check payload if something is missing
export class PeachWebhookPayload {
  eventType: string;
  userId: string;
  borrowerId: string;
  loanId: string;
  transactionId: string;
  borrower: Borrower;
  currency: string;
  transaction: {
    actualAmount: number;
    autopayPaymentIds: string | null;
    autopayPlanId: null;
    cancelLongDescription: string | null;
    cancelReason: string | null;
    cancelShortDescription: string | null;
    chargebackDetails: { amount: number; chargebacks: object[] };
    drawId: null;
    externalId: string;
    failureDescriptionLong: string | null;
    failureDescriptionShort: string | null;
    failureReason: string | null;
    id: string;
    isExternal: boolean;
    isVirtual: boolean;
    loanId: string;
    mainBorrowerId: string;
    metaData: object | null;
    paidFeesAmount: number;
    paidInterestAmount: number;
    paidOverAmount: number;
    paidPrincipalAmount: number;
    parentTransactionId: string | null;
    paymentDetails: {
      fromInstrument: {
        accountNumberLastFour: string;
        instrumentType: string;
        routingNumber: string;
      };
      fromInstrumentId: string;
      reason: string;
      toInstrument: {
        accountNumberLastFour: string | null;
        instrumentType: string;
      };
      toInstrumentId: string;
      type: 'ach' | string;
    };
    status: PeachTransactionStatus;
    timestamps: object;
    transactionType: 'payment';
  };
  loan: object;
}

export class PeachPaymentUpdatedPayload {
  userId: string;
  borrowerId: string;
  loanId: string;
  transaction: {
    actualAmount: number;
    drawId: null;
    externalId: string;
    id: string;
    metaData: object | null;
    parentTransactionId: string | null;
    paymentDetails: {
      fromInstrumentId: string;
    };
    status: PeachTransactionStatus;
    currency: string;
  };
}
