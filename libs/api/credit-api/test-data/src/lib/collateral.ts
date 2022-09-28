<<<<<<< HEAD
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
=======
import { CollateralDepositCompletedPayload } from '@archie/api/credit-api/data-transfer-objects';
import { user } from '@archie/test/integration';

export const collateralDepositCompletedDataFactory = (
  override?: Partial<CollateralDepositCompletedPayload>,
): CollateralDepositCompletedPayload => ({
  asset: 'BTC',
  userId: user.id,
  amount: '1',
  transactionId: 'transactionId',
  ...override,
});
>>>>>>> develop
