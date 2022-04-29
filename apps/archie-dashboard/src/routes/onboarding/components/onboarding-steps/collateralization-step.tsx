import { CollateralDeposit } from '../../../../components/collateral-deposit/collateral-deposit';
import { Collateral } from '../../../../components/collateral/collateral';

export const CollateralizationStep: React.FC = () => {
  return (
    <>
      <Collateral />
      <CollateralDeposit assetName="Bitcoin" assetId="BTC_TEST" />
      <CollateralDeposit assetName="Ethereum" assetId="ETH_TEST" />
      <CollateralDeposit assetName="USD Coin" assetId="USDC_T" />
      <CollateralDeposit assetName="Solana" assetId="SOL_TEST" />
    </>
  );
};
