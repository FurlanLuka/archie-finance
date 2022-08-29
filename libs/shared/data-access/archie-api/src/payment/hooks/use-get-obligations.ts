import { useExtendedQuery } from '../../helper-hooks';
import { QueryResponse, RequestState } from '../../interface';
import { getObligations, Obligation } from '../api/get-obligations';
import { MISSING_PAYMENT_INFO_ERROR, UserObligations } from '../payment.interfaces';

export const OBLIGATIONS_RECORD_QUERY_KEY = 'obligations_record';
const MISSING_DATE = 'MISSING_DATE';

export const useGetObligations = (): QueryResponse<UserObligations> => {
  const queryResponse = useExtendedQuery(OBLIGATIONS_RECORD_QUERY_KEY, async (accessToken: string) => {
    const obligationsResponse = await getObligations(accessToken);

    // TODO parse dueDate in the query hook
    return {
      dueDate: obligationsResponse.futureObligations[0]?.dueDate ?? MISSING_DATE,
      balanceOwed: obligationsResponse.statementObligations.reduce(
        (sum, obligation: Obligation) => sum + obligation.remainingAmount,
        0,
      ),
      fullBalance: obligationsResponse.outstandingBalances.outstandingTotalAmount,
      interestOwed: obligationsResponse.outstandingBalances.outstandingInterestAmount,
    };
  });

  // if no due date is present, something is wrong on Peach
  if (queryResponse.state === RequestState.SUCCESS && queryResponse.data.dueDate === MISSING_DATE) {
    return {
      state: RequestState.ERROR,
      error: {
        name: MISSING_PAYMENT_INFO_ERROR,
        message: 'No payment due date',
      },
    };
  }

  return queryResponse;
};
