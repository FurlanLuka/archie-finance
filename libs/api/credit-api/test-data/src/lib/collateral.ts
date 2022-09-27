import { GetCollateralValueResponse } from '@archie/api/credit-api/collateral';

export const getCollateralValueResponse = (
  override?: GetCollateralValueResponse[],
): GetCollateralValueResponse[] => {
  const defaultCollateralValue = [
    {
      asset: 'BTC',
      price: 20000,
      assetAmount: '1',
    },
  ];

  return override ?? defaultCollateralValue;
};
