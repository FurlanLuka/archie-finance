import {
  DepositAddressResponse,
  VaultAccountResponse,
  VaultAssetResponse,
} from 'fireblocks-sdk';
import { user } from '../../../../test/test-data/user.data';

export const getVaultAccountResponseData = (
  overrides?: Partial<VaultAccountResponse>,
): VaultAccountResponse => {
  const defaultResponse: VaultAccountResponse = {
    id: '1',
    name: user.id,
    hiddenOnUI: true,
    assets: [],
    customerRefId: user.id,
    autoFuel: true,
  };

  return {
    ...defaultResponse,
    ...overrides,
  };
};

export const getDepositAddressResponseData = (
  asset: string,
  overrides?: Partial<DepositAddressResponse>,
): DepositAddressResponse => {
  const defaultDepositAddress: DepositAddressResponse = {
    assetId: asset,
    address: `some-random-address-${asset}`,
    type: 'type',
    addressFormat: 'format',
  };

  return {
    ...defaultDepositAddress,
    ...overrides,
  };
};

export const getVaultAssetResponseData = (
  overrides?: Partial<VaultAssetResponse>,
): VaultAssetResponse => {
  const defaultResponse: VaultAssetResponse = {
    id: 'id',
    address: 'address',
    legacyAddress: 'legacy-address',
    tag: '',
    eosAccountName: 'idk',
  };

  return {
    ...defaultResponse,
    ...overrides,
  };
};
