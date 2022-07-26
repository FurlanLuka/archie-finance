import { user } from '../../../../../../../apps/credit-api/test/test-data/user.data';
import { Collateral } from '../collateral.entity';
import { CollateralDeposit } from '../collateral_deposit.entity';

export const getCollateralRecord = (
  asset: string,
  overrides?: Partial<Collateral>,
): Collateral => {
  const defaultRecord: Collateral = {
    id: 'id',
    userId: user.id,
    asset,
    amount: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  return {
    ...defaultRecord,
    ...overrides,
  };
};

export const getCollateralDepositRecord = (
  asset: string,
  overrides?: Partial<CollateralDeposit>,
): CollateralDeposit => {
  const defaultRecord: CollateralDeposit = {
    transactionId: 'transactionId',
    userId: user.id,
    asset,
    amount: 1,
    status: 'COMPLETED',
    destinationAddress: `destination-address-${asset}`,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  return {
    ...defaultRecord,
    ...overrides,
  };
};
