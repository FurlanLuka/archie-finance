import { GetDepositAddressResponse } from './deposit_address.interfaces';

export class GetDepositAddressResponseDto implements GetDepositAddressResponse {
  address: string;
}
