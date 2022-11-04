import { DepositAddress } from './deposit_address.interfaces';

export class DepositAddressDto implements DepositAddress {
  address: string;
  asset: string;
}
