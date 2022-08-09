export interface GetLinkTokenResponse {
  token: string;
}

export interface SetAccessTokenBody {
  publicToken: string;
}

export interface SetAccessTokenResponse {
  itemId: string;
}

export interface AccountResponse {
  id: string;
  name: string;
  mask: string;
  availableBalance: number;
  currencyISO: string;
  subtype: string;
}

export type GetAccountsResponse = AccountResponse[];
export type GetLinkableAccountsResponse = AccountResponse[];
