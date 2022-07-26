import { GetDepositAddressResponse } from './deposit-address.interfaces';

export class GetDepositAddressResponseDto implements GetDepositAddressResponse {
  address: string;
}
