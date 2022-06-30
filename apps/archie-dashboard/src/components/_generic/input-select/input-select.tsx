import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { ParagraphXS } from '@archie-webapps/ui-design-system';
import { Icon } from '@archie-webapps/ui-icons';

import { CollateralCurrency } from '../../../components/collateral-currency/collateral-currency';
import { CollateralDeposit } from '../../../components/collateral-deposit/collateral-deposit';
import { CollateralAsset, collateralAssets } from '../../../constants/data/collateral-assets';

import { InputSelectStyled } from './input-select.styled';


interface InputSelectProps {
  setSelectedAsset: (asset?: CollateralAsset) => void;
}

export const InputSelect: FC<InputSelectProps> = ({ setSelectedAsset }) => {
  const { t } = useTranslation();

  const [selectOpen, setSelectOpen] = useState(false);
  const [selectedAssetId, setSelectedAssetId] = useState('');

  const findAsset = (assetId: string) => collateralAssets.find((asset) => asset.id === assetId);

  const handleSelect = (assetId: string) => {
    setSelectedAssetId(assetId);
    setSelectedAsset(findAsset(assetId));
    setSelectOpen(false);
  };

  return (
    <InputSelectStyled>
      <ParagraphXS weight={700}>{t('collateralization_step.inputs.input_select_label')}</ParagraphXS>
      <div className="select-header" onClick={() => setSelectOpen(!selectOpen)}>
        {selectedAssetId ? (
          <CollateralCurrency
            icon={findAsset(selectedAssetId)?.icon}
            name={findAsset(selectedAssetId)?.name}
            short={findAsset(selectedAssetId)?.short}
          />
        ) : (
          <CollateralCurrency name="Select your collateral currency" short="BTC, ETH, SOL, or USDC" />
        )}
        <Icon name="caret" className={selectOpen ? 'select-header-caret open' : 'select-header-caret'} />
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
