import { useExtendedQuery } from '../../helper-hooks';
import { QueryResponse } from '../../interface';
import {
  getDepositAddress,
  GetDepositAddressResponse,
} from '../api/get-deposit-address';

const getDepositAddressQueryKey = (assetId: string) => [
  'deposit_address',
  assetId,
];

export const useGetDepositAddress = (
  assetId: string,
): QueryResponse<GetDepositAddressResponse> => {
  return useExtendedQuery(
    getDepositAddressQueryKey(assetId),
    async (accessToken: string) => getDepositAddress(assetId, accessToken),
  );
};
