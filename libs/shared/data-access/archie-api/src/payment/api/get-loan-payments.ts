import { API_URL } from '@archie-webapps/shared/constants';

import { getRequest } from '../../helpers';

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

export interface PaymentResponseData {
  id: string;
  isExternal: boolean;
  status: PaymentStatus;
  transactionType: string;
  paymentDetails: {
    type: string;
    reason: string;
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

export const ERROR_LIST = new Map<string, string>([]);

export const getLoanPayments = (accessToken: string, fromDate: string, toDate: string) => {
  return getRequest<PaymentsResponse>(
    `${API_URL}/v1/loan_payments?fromEffectiveDate=${fromDate}&toEffectiveDate=${toDate}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
    ERROR_LIST,
  );
};
