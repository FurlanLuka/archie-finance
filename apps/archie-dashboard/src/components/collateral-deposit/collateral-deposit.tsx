import { FC } from 'react';
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
  const getDepositAddressResponse: QueryResponse<GetDepositAddressResponse> = useGetDepositAddress(assetId, true);

  const getDepositAddress = () => {
    if (getDepositAddressResponse.state === RequestState.SUCCESS) {
      setCollateralDeposit({ id: assetId, address: getDepositAddressResponse.data.address });
    }
  };

  const curency: CollateralCurrency | undefined = collateralCurrencies.find((currency) => currency.id === assetId);

  return (
    <CollateralDepositStyled onClick={getDepositAddress}>
      <CollateralCurency icon={curency?.icon} name={curency?.name} short={curency?.short} />
    </CollateralDepositStyled>
  );
};
