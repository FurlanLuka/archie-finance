import { useState } from 'react';
import { GetDepositAddressResponse } from '@archie/api-consumer/deposit_address/api/get-deposit-address';
import { useGetDepositAddress } from '@archie/api-consumer/deposit_address/hooks/use-get-deposit-address';
import { QueryResponse, RequestState } from '@archie/api-consumer/interface';

interface CollateralDepositProps {
  assetName: string;
  assetId: string;
}

export const CollateralDeposit: React.FC<CollateralDepositProps> = ({
  assetName,
  assetId,
}: CollateralDepositProps) => {
  const [shouldGetAddress, setShouldGetAddress] = useState(false);

  const getDepositAddressResponse: QueryResponse<GetDepositAddressResponse> =
    useGetDepositAddress(assetId, shouldGetAddress);

  const getDepositAddress = () => {
    setShouldGetAddress(true);
  };

  return (
    <div className="collateral-deposit-container" onClick={getDepositAddress}>
      {(getDepositAddressResponse.state === RequestState.IDLE ||
        getDepositAddressResponse.state === RequestState.ERROR ||
        getDepositAddressResponse.state === RequestState.LOADING) && (
        <>
          <span className="collateral-deposit-container__title">
            {assetName}
          </span>
          <span className="collateral-deposit-container__subtitle">
            Click to generate deposit address
          </span>
        </>
      )}
      {getDepositAddressResponse.state === RequestState.SUCCESS && (
        <>
          <span className="collateral-deposit-container__title">
            {assetName}
          </span>
          <span className="collateral-deposit-container__deposit-address">
            {getDepositAddressResponse.data.address}
          </span>
        </>
      )}
    </div>
  );
};
