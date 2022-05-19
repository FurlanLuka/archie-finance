import { FC } from 'react';
import { GetDepositAddressResponse } from '@archie/api-consumer/deposit_address/api/get-deposit-address';
import { useGetDepositAddress } from '@archie/api-consumer/deposit_address/hooks/use-get-deposit-address';
import { QueryResponse, RequestState } from '@archie/api-consumer/interface';
import { CollateralDepositStyled } from './collateral-deposit.styled';

interface CollateralDepositProps {
  assetName: string;
  assetId: string;
  setAddress: (address: string) => void;
}

export const CollateralDeposit: FC<CollateralDepositProps> = ({ assetName, assetId, setAddress }) => {
  const getDepositAddressResponse: QueryResponse<GetDepositAddressResponse> = useGetDepositAddress(assetId, true);

  const getDepositAddress = () => {
    if (getDepositAddressResponse.state === RequestState.SUCCESS) {
      setAddress(getDepositAddressResponse.data.address);
    }
  };

  return (
    <CollateralDepositStyled onClick={getDepositAddress}>
      <span>{assetName}</span>
    </CollateralDepositStyled>
  );
};
