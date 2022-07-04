import { TransactionResponse } from './rize.interfaces';

export class TransactionResponseDto implements TransactionResponse {
  date: string;
  description: string;
  type: string;
  status: string;
  amount: string;
}
