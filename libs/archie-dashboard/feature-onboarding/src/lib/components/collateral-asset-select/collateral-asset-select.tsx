import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { ParagraphXS } from '@archie-webapps/ui-design-system';
import { Icon } from '@archie-webapps/ui-icons';
import { CollateralAsset, collateralAssets } from '@archie-webapps/util-constants';

import { CollateralCurrency } from './blocks/collateral-currency/collateral-currency';
import * as Styled from './collateral-asset-select.styled';

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
    <Styled.CollateralCurrencySelect>
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
          {Object.values(collateralAssets).map((asset) => (
            <Styled.CollateralDeposit key={asset.id} onClick={() => handleSelect(asset)}>
              <CollateralCurrency icon={asset.icon} name={asset.name} short={asset.short} />
            </Styled.CollateralDeposit>
          ))}
        </div>
      )}
    </Styled.CollateralCurrencySelect>
  );
};
