import { FC } from 'react';
import { collateralAssets, CollateralAsset } from '../../constants/collateral-assets';
import { CollateralCurrency } from '../collateral-currency/collateral-currency';
import { CollateralDepositStyled } from './collateral-deposit.styled';

interface CollateralDepositProps {
  assetId: string;
  setSelectedAsset: (assetId: string) => void;
}

export const CollateralDeposit: FC<CollateralDepositProps> = ({ assetId, setSelectedAsset }) => {
  const curency: CollateralAsset | undefined = collateralAssets.find((asset) => asset.id === assetId);

  return (
    <CollateralDepositStyled onClick={() => setSelectedAsset(assetId)}>
      <CollateralCurrency icon={curency?.icon} name={curency?.name} short={curency?.short} />
    </CollateralDepositStyled>
  );
};
