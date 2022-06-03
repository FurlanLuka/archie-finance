import { FC, useState, useEffect } from 'react';
import { QueryResponse, RequestState } from '@archie/api-consumer/interface';
import { GetDepositAddressResponse } from '@archie/api-consumer/deposit_address/api/get-deposit-address';
import { useGetDepositAddress } from '@archie/api-consumer/deposit_address/hooks/use-get-deposit-address';
import { CollateralDeposit } from '../../../components/collateral-deposit/collateral-deposit';
import { CollateralAsset, collateralAssets } from '../../../constants/collateral-assets';
import { CollateralCurrency } from '../../../components/collateral-currency/collateral-currency';
import { Caret } from '../../../components/_generic/icons/caret';
import { ParagraphXS } from '../typography/typography.styled';
import { InputSelectStyled } from './input-select.styled';

interface InputSelectProps {
  setSelectedAsset: (asset: CollateralAsset | undefined) => void;
}

export const InputSelect: FC<InputSelectProps> = ({ setSelectedAsset }) => {
  const [selectOpen, setSelectOpen] = useState(false);
  const [selectedAssetId, setSelectedAssetId] = useState('');

  const handleSelect = (assetId: string) => {
    setSelectedAssetId(assetId);
    setSelectedAsset(collateralAssets.find((asset) => asset.id === assetId));
    setSelectOpen(false);
  };

  return (
    <InputSelectStyled>
      <ParagraphXS weight={700}>Collateral</ParagraphXS>
      <div className="select-header" onClick={() => setSelectOpen(!selectOpen)}>
        {selectedAssetId ? (
          <CollateralCurrency
            icon={collateralAssets.find((asset) => asset.id === selectedAssetId)?.icon}
            name={collateralAssets.find((asset) => asset.id === selectedAssetId)?.name}
            short={collateralAssets.find((asset) => asset.id === selectedAssetId)?.short}
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
