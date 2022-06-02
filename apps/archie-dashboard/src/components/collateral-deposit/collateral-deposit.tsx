import { FC } from 'react';
import { collateralCurrencies, CollateralCurrency } from '../../constants/collateral-curencies';
import { CollateralDepositStyled } from './collateral-deposit.styled';
import { CollateralCurency } from '../collateral-curency/collateral-curency';

interface CollateralDepositProps {
  assetId: string;
  setSelectedAsset: (assetId: string) => void;
}

export const CollateralDeposit: FC<CollateralDepositProps> = ({ assetId, setSelectedAsset }) => {
  const curency: CollateralCurrency | undefined = collateralCurrencies.find((currency) => currency.id === assetId);

  return (
    <CollateralDepositStyled onClick={() => setSelectedAsset(assetId)}>
      <CollateralCurency icon={curency?.icon} name={curency?.name} short={curency?.short} />
    </CollateralDepositStyled>
  );
};
