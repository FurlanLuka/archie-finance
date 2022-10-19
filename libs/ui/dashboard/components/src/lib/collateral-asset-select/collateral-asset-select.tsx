import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { CollateralAsset, CollateralAssets } from '@archie/ui/shared/constants';
import {
  CollateralCurrency,
  Select,
  SelectOption,
  BodyM,
} from '@archie/ui/shared/design-system';

import { CollateralAssetStyled } from './collateral-asset-select.styled';

interface InputSelectProps {
  selectedAsset?: CollateralAsset;
  setSelectedAsset: (asset: CollateralAsset) => void;
}

export const CollateralAssetSelect: FC<InputSelectProps> = ({
  selectedAsset,
  setSelectedAsset,
}) => {
  const { t } = useTranslation();

  const handleSelect = (asset: CollateralAsset) => {
    setSelectedAsset(asset);
  };

  const header = selectedAsset ? (
    <CollateralCurrency
      icon={selectedAsset.icon}
      name={selectedAsset.name}
      short={selectedAsset.short}
    />
  ) : (
    <CollateralCurrency
      name="Select your collateral currency"
      short="BTC, ETH, SOL, or USDC"
    />
  );

  const options = Object.values(CollateralAssets).map((asset) => (
    <SelectOption className="collateral-deposit" key={asset.id} value={asset}>
      <CollateralCurrency
        icon={asset.icon}
        name={asset.name}
        short={asset.short}
      />
    </SelectOption>
  ));

  return (
    <CollateralAssetStyled>
      <BodyM className="select-label" weight={700}>
        {t('collateralization_step.inputs.input_select_label')}
      </BodyM>
      <Select
        id="collateral-asset"
        width="100%"
        header={header}
        onChange={handleSelect}
      >
        {options}
      </Select>
    </CollateralAssetStyled>
  );
};
