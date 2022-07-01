import { TotalCollateralValue } from '@archie/api-consumer/collateral/api/get-collateral-total-value';
import { usePollCollateralTotalValue } from '@archie/api-consumer/collateral/hooks/use-poll-collateral-total-value';
import { useCreateCreditLine } from '@archie/api-consumer/credit/hooks/use-create-credit-line';
import { MutationQueryResponse, QueryResponse, RequestState } from '@archie/api-consumer/interface';
import { useEffect, useState } from 'react';

// TODO rewrite into just a hook?
export const Collateral: React.FC = () => {
  const [shouldPoll, setShouldPoll] = useState(true);
  const getCollateralTotalValueResponse: QueryResponse<TotalCollateralValue> = usePollCollateralTotalValue(shouldPoll);
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
