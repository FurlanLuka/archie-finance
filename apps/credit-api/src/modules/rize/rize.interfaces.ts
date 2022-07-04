export interface TransactionResponse {
  created_at: string;
  settled_at: string;
  description: string;
  type: string; // TODO: enum
  status: string;
  amount: string;
}
