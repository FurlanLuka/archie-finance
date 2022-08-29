import { API_URL } from '../../constants';
import { getRequest } from '../../helpers';

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

export const ERROR_LIST = new Map<string, string>([]);

export const getObligations = async (accessToken: string): Promise<GetObligationsResponse> => {
  return getRequest<GetObligationsResponse>(
    `${API_URL}/v1/obligations`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
    ERROR_LIST,
  );
};
