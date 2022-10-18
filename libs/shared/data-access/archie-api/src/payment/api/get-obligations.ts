import { API_URL } from '@archie-webapps/shared/constants';

import { getRequest } from '../../helpers';

export const MISSING_PAYMENT_INFO_ERROR = 'MISSING_PAYMENT_INFO_ERROR';
export const CREDIT_LINE_NOT_FOUND_ERROR = 'CREDIT_LINE_NOT_FOUND_ERROR';

export interface Obligation {
  capitalizedAmount: number;
  dueDate: string;
  fulfilledAmount: number;
  gracePeriod: string | null;
  isOverdue: boolean;
  obligationAmount: number;
  overpaymentsAmount: number;
  remainingAmount: number;
}

export interface UserObligations {
  dueDate: Date;
  balanceOwed: number;
  fullBalance: number;
  interestOwed: number;
}

export interface GetObligationsResponse {
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
  statementObligations: Obligation[];
  futureObligations: Obligation[];
}

export const ERROR_LIST = new Map<string, string>([
  [CREDIT_LINE_NOT_FOUND_ERROR, 'obligation_api.credit_line_not_found'],
]);

export const getObligations = async (accessToken: string): Promise<GetObligationsResponse> => {
  return getRequest<GetObligationsResponse>(
    `${API_URL}/v1/loan_obligations`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
    ERROR_LIST,
  );
};
