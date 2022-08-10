import { AxiosRequestConfig } from 'axios';

export interface PeachErrorResponse {
  config: AxiosRequestConfig;
  status: number;
  errorResponse: PeachErrorData;
}

export interface PeachErrorData {
  message: string;
  status: number;
}

export interface PaymentApplied {
  accrualDate: string | null;
  amount: number;
  caseExternalId: string | null;
  caseId: string | null;
  caseTypeId: string | null;
  companyId: string;
  createdAt: string;
  creatingMessageId: string;
  currency: 'USD';
  deletedAt: string | null;
  discriminator: string;
  effectiveAt: string;
  eventClass: 'PaymentAppliedEvent';
  eventType: 'payment.applied';
  id: string;
  interactionId: string | null;
  isExternal: boolean;
  loanExternalId: string | null;
  loanId: string;
  loanTypeId: string;
  maintenanceDate: string | null;
  object: 'event';
  parentId: string;
  paymentInstrumentExternalId: string | null;
  paymentInstrumentId: string;
  paymentInstrumentType: string;
  personExternalId: string | null;
  personId: string;
  requestId: string;
  sessionId: string | null;
  transactionExternalId: string | null;
  transactionId: string;
  updatedAt: string | null;
  userId: string;
}

export interface EventsResponse<T> {
  count: number;
  data: T[];
  nextUrl: string | null;
  previousUrl: string | null;
  status: number;
  total: number;
}
