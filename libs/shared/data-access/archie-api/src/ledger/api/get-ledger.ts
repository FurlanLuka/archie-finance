import { API_URL } from '../../constants';
import { getRequest } from '../../helpers';

export interface LedgerAccountData {
  assetId: string;
  assetAmount: string;
  assetPrice: string;
  accountValue: string;
}

export interface Ledger {
  value: string;
  accounts: LedgerAccountData[];
}

export const ERROR_LIST = new Map<string, string>([]);

export const getLedger = async (accessToken: string): Promise<Ledger> => {
  return getRequest<Ledger>(
    `${API_URL}/v1/ledger`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
    ERROR_LIST,
  );
};
