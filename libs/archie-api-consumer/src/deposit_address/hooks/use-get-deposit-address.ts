import { QueryResponse } from '../../interface';
import {
  getDepositAddress,
  GetDepositAddressResponse,
} from '../api/get-deposit-address';
import { useExtendedQuery } from '../../helper-hooks';

const getDepositAddressQueryKey = (assetId: string) =>
  `deposit_address_${assetId}`;

export const useGetDepositAddress = (
  assetId: string,
  enabled: boolean = false,
): QueryResponse<GetDepositAddressResponse> => {
  return useExtendedQuery(
    getDepositAddressQueryKey(assetId),
    async (accessToken: string) => getDepositAddress(assetId, accessToken),
    {
      enabled,
    },
  );
};
