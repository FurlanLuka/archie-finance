import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { CollateralAsset, CollateralAssets } from '@archie-webapps/shared/constants';
import { CollateralCurrency, ParagraphXS } from '@archie-webapps/shared/ui/design-system';
import { Icon } from '@archie-webapps/shared/ui/icons';

import { CollateralCurrencySelect, CollateralDeposit } from './collateral-asset-select.styled';

interface InputSelectProps {
  selectedAsset?: CollateralAsset;
  setSelectedAsset: (asset: CollateralAsset) => void;
}

// TODO create an ordinary select with children instead of proprietary one
export const CollateralAssetSelect: FC<InputSelectProps> = ({ selectedAsset, setSelectedAsset }) => {
  const { t } = useTranslation();

  const [selectOpen, setSelectOpen] = useState(false);

  const handleSelect = (asset: CollateralAsset) => {
    setSelectedAsset(asset);
    setSelectOpen(false);
  };

  return (
    <CollateralCurrencySelect>
      <ParagraphXS weight={700}>{t('collateralization_step.inputs.input_select_label')}</ParagraphXS>
      <div className="select-header" onClick={() => setSelectOpen(!selectOpen)}>
        {selectedAsset ? (
          <CollateralCurrency icon={selectedAsset.icon} name={selectedAsset.name} short={selectedAsset.short} />
        ) : (
          <CollateralCurrency name="Select your collateral currency" short="BTC, ETH, SOL, or USDC" />
        )}
        <Icon name="caret" className={selectOpen ? 'select-header-caret open' : 'select-header-caret'} />
      </div>
      {selectOpen && (
        <div className="select-list">
          {Object.values(CollateralAssets).map((asset) => (
            <CollateralDeposit key={asset.id} onClick={() => handleSelect(asset)}>
              <CollateralCurrency icon={asset.icon} name={asset.name} short={asset.short} />
            </CollateralDeposit>
          ))}
        </div>
      )}
    </CollateralCurrencySelect>
  );
};
