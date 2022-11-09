import { Statement } from './peach-api.interfaces';
import { LoanDocument } from './statements.interfaces';

export class LoanDocumentDto implements LoanDocument {
  url: string;
}

export class StatementDto implements Statement {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  periodId: string;
  version: number;
  billingCycleStartDate: string;
  billingCycleEndDate: string;
  paymentDueDate: string;
  documentDescriptorId: string;
  statementDate: string;
  minimumDueAmount: number;
  overdueAmount: number;
  newBalanceAmount: number;
}
