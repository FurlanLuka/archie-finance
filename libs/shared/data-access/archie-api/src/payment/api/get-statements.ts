import { API_URL } from '@archie-microservices/ui/shared/constants';

import { getRequest } from '../../helpers';

export interface Statement {
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

export const ERROR_LIST = new Map<string, string>([]);

export const getStatements = async (
  accessToken: string,
): Promise<Statement[]> => {
  return getRequest<Statement[]>(
    `${API_URL}/v1/loan_statements`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
    ERROR_LIST,
  );
};
