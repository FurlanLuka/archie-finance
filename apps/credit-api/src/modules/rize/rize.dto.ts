import { TransactionResponse } from './rize.interfaces';

export class TransactionResponseDto implements TransactionResponse {
  description: string;
  type: string;
  status: string;
  amount: string;
  settled_at: string;
  created_at: string;
}
