export interface GetLinkTokenResponse {
  token: string;
}

export interface SetAccessTokenBody {
  publicToken: string;
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
