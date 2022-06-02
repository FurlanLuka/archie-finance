import { FC, useState, useEffect } from 'react';
import { QueryResponse, RequestState } from '@archie/api-consumer/interface';
import { GetDepositAddressResponse } from '@archie/api-consumer/deposit_address/api/get-deposit-address';
import { useGetDepositAddress } from '@archie/api-consumer/deposit_address/hooks/use-get-deposit-address';
import { CollateralDeposit } from '../../../components/collateral-deposit/collateral-deposit';
import { collateralAssets, CollateralAsset } from '../../../constants/collateral-assets';
import { CollateralCurrency } from '../../../components/collateral-currency/collateral-currency';
import { Caret } from '../../../components/_generic/icons/caret';
import { ParagraphXS } from '../typography/typography.styled';
import { InputSelectStyled } from './input-select.styled';

interface InputSelectProps {
  collateralDeposit: { id: string; address: string };
  setCollateralDeposit: (params: { id: string; address: string }) => void;
  selectedCollateralDeposit?: CollateralAsset;
}

export const InputSelect: FC<InputSelectProps> = ({
  collateralDeposit,
  setCollateralDeposit,
  selectedCollateralDeposit,
}) => {
  const [selectOpen, setSelectOpen] = useState(false);
  const [shouldCall, setShouldCall] = useState(false);
  const [selectedAssetId, setSelectedAssetId] = useState('');

  const getDepositAddressResponse: QueryResponse<GetDepositAddressResponse> = useGetDepositAddress(
    selectedAssetId,
    shouldCall,
  );

  // useEffect(() => {
  //   if (selectedAssetId.length > 0) {
  //     setShouldCall(true);
  //   }
  // }, [selectedAssetId]);

  useEffect(() => {
    if (getDepositAddressResponse.state === RequestState.SUCCESS) {
      setCollateralDeposit({ id: selectedAssetId, address: getDepositAddressResponse.data.address });
    }
  }, [getDepositAddressResponse, selectedAssetId]);

  const handleSelect = (assetId: string) => {
    setSelectedAssetId(assetId);

    setShouldCall(true);
    setSelectOpen(false);
  };

  // const handleSelect = (assetId: string) => {
  //   setSelectedAssetId(assetId);
  //   setShouldCall(true);

  //   if (getDepositAddressResponse.state === RequestState.SUCCESS) {
  //     setSelectOpen(false);
  //     setCollateralDeposit({ id: selectedAssetId, address: getDepositAddressResponse.data.address });
  //   }
  // };

  return (
    <InputSelectStyled>
      <ParagraphXS weight={700}>Collateral</ParagraphXS>
      <div className="select-header" onClick={() => setSelectOpen(!selectOpen)}>
        {collateralDeposit.address ? (
          <CollateralCurrency
            icon={selectedCollateralDeposit?.icon}
            name={selectedCollateralDeposit?.name}
            short={selectedCollateralDeposit?.short}
          />
        ) : (
          <CollateralCurrency name="Select your collateral currency" short="BTC, ETH, SOL, or USDC" />
        )}
        <Caret className={selectOpen ? 'select-header-caret open' : 'select-header-caret'} />
      </div>
      {selectOpen && (
        <div className="select-list">
          {collateralAssets.map((asset, index) => (
            <div className="select-option" key={index}>
              <CollateralDeposit assetId={asset.id} setSelectedAsset={handleSelect} />
            </div>
          ))}
        </div>
      )}
    </InputSelectStyled>
  );
};
