export interface GetLinkTokenResponse {
  token: string;
}

export interface SetAccessTokenBody {
  publicToken: string;
}

export interface AccountResponse {
  id: string;
  name: string;
  officialName: string;
  mask: string;
}

export type GetAccountsResponse = AccountResponse[];
