import { CollateralRecord } from './collateral-record';
import { useGetCollateral } from '@archie/api-consumer/collateral/hooks/use-get-collateral';
import { Collateral as ICollateral } from '@archie/api-consumer/collateral/api/get-collateral';
import { QueryResponse, RequestState } from '@archie/api-consumer/interface';

export const Collateral: React.FC = () => {
  const getCollateralResponse: QueryResponse<ICollateral[]> =
    useGetCollateral();

  const getAmount = (assetId: string) => {
    if (getCollateralResponse.state === RequestState.SUCCESS) {
      const result = getCollateralResponse.data.find(
        (collateral) => collateral.asset === assetId,
      );

      if (result === undefined) {
        return 0;
      }

      return result.amount;
    }

    return 0;
  };

  return (
    <div className="collateral-container">
      <div className="collateral-container__title">Deposited collateral</div>
      <CollateralRecord assetName="BTC" amount={getAmount('BTC_TEST')} />
      <CollateralRecord assetName="ETH" amount={getAmount('ETH_TEST')} />
      <CollateralRecord assetName="USDC" amount={getAmount('USDC_T')} />
      <CollateralRecord assetName="SOL" amount={getAmount('SOL_TEST')} />
    </div>
  );
};
