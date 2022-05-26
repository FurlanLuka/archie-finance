import { user } from '../../../../test/test-data/user.data';
import { DepositAddress } from '../deposit_address.entity';

export const getDepositAddressData = (
  asset: string,
  overrides?: DepositAddress,
): DepositAddress => {
  const defaultData: DepositAddress = {
    id: 'id',
    asset,
    address: `address-${asset}`,
    userId: user.id,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  return {
    ...defaultData,
    ...overrides,
  };
};
