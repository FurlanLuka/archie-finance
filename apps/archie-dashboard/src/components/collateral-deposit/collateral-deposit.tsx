import { FC, useEffect, useState } from 'react';
import { GetDepositAddressResponse } from '@archie/api-consumer/deposit_address/api/get-deposit-address';
import { useGetDepositAddress } from '@archie/api-consumer/deposit_address/hooks/use-get-deposit-address';
import { QueryResponse, RequestState } from '@archie/api-consumer/interface';
import { collateralCurrencies, CollateralCurrency } from '../../constants/collateral-curencies';
import { CollateralDepositStyled } from './collateral-deposit.styled';
import { CollateralCurency } from '../collateral-curency/collateral-curency';

interface CollateralDepositProps {
  assetId: string;
  setCollateralDeposit: (params: { id: string; address: string }) => void;
}

export const CollateralDeposit: FC<CollateralDepositProps> = ({ assetId, setCollateralDeposit }) => {
  const [shouldCall, setShouldCall] = useState(false);

  const getDepositAddressResponse: QueryResponse<GetDepositAddressResponse> = useGetDepositAddress(assetId, shouldCall);

  useEffect(() => {
    if (getDepositAddressResponse.state === RequestState.SUCCESS) {
      setCollateralDeposit({ id: assetId, address: getDepositAddressResponse.data.address });
    }
  }, [getDepositAddressResponse]);

  const getDepositAddress = () => {
    setShouldCall(true);
  };

  const curency: CollateralCurrency | undefined = collateralCurrencies.find((currency) => currency.id === assetId);

  return (
    <CollateralDepositStyled onClick={getDepositAddress}>
      <CollateralCurency icon={curency?.icon} name={curency?.name} short={curency?.short} />
    </CollateralDepositStyled>
  );
};
