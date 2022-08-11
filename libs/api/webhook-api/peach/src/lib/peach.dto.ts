import { Payment } from './api/peach_api.interfaces';

export class WebhookPaymentPayload implements Payment {
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
  eventClass: string;
  eventType: string;
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
  personExternalId: string;
  personId: string;
  requestId: string;
  sessionId: string | null;
  transactionExternalId: string | null;
  transactionId: string;
  updatedAt: string | null;
}
