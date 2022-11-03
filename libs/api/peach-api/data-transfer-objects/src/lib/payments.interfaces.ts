import { PaymentReason, PaymentStatus, PaymentType, TransactionType } from './peach-api.interfaces';

export interface PaymentResponseData {
  id: string;
  isExternal: boolean;
  status: PaymentStatus;
  transactionType: TransactionType;
  paymentDetails: {
    type: PaymentType;
    reason: PaymentReason;
    fromInstrumentId: string;
    paymentNetworkName: string;
    accountNumberLastFour?: string;
  };
  actualAmount: number;
  currency: string;
  failureDescriptionShort: string | null;
  failureDescriptionLong: string | null;
  autopayPlanId: string | null;
  cancelReason: string | null;
  timestamps: {
    createdAt: string;
    scheduledDate: string | null;
    succeededAt: string | null;
    failedAt: string | null;
    chargebackAt: string | null;
  };
}

export interface PaymentsResponse {
  meta: {
    total: number;
    count: number;
    nextUrl: string | null;
    previousUrl: string | null;
  };
  data: PaymentResponseData[];
}

export interface ScheduleTransaction {
  amount: number;
  scheduledDate?: string | null;
  paymentInstrumentId: string;
}
