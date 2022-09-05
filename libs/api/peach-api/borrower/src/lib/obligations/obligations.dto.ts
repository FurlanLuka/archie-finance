class Obligation {
  capitalizedAmount: number;
  dueDate: string;
  fulfilledAmount: number;
  gracePeriod: string | null;
  isOverdue: boolean;
  obligationAmount: number;
  overpaymentsAmount: number;
  remainingAmount: number;
}

export class ObligationsResponseDto {
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
