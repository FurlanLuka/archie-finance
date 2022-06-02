import { MutationQueryResponse, QueryResponse, RequestState } from '@archie/api-consumer/interface';
import { useGetCollateralTotalValue } from '@archie/api-consumer/collateral/hooks/use-get-collateral-total-value';
import { TotalCollateralValue } from '@archie/api-consumer/collateral/api/get-collateral-total-value';
import { useCreateCreditLine } from '@archie/api-consumer/credit/hooks/use-create-credit-line';
import { useEffect, useState } from 'react';

export const Collateral: React.FC = () => {
  const [shouldPoll, setShouldPoll] = useState(true);
  const getCollateralTotalValueResponse: QueryResponse<TotalCollateralValue> = useGetCollateralTotalValue(shouldPoll);
  const createCreditLine: MutationQueryResponse = useCreateCreditLine();

  useEffect(() => {
    if (getCollateralTotalValueResponse.state === RequestState.SUCCESS) {
      if (parseInt(getCollateralTotalValueResponse.data.value) > 200) {
        if (createCreditLine.state === RequestState.ERROR) {
          setShouldPoll(true);

          return;
        }

        setShouldPoll(false);

        if (createCreditLine.state === RequestState.IDLE) {
          createCreditLine.mutate({});

          return;
        }
      }
    }
  }, [getCollateralTotalValueResponse, createCreditLine]);
  return <></>;
};
