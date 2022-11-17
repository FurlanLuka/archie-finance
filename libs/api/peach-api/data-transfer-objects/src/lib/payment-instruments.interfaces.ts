export interface PaymentInstrument {
  id: string;
  name: string;
  mask: string;
  subType: string;
}

export interface ConnectAccountBody {
  accountId: string;
  publicToken: string;
}
