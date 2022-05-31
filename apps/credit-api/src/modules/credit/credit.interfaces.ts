import { Credit } from './credit.entity';

export type GetCreditResponse = Omit<
  Credit,
  'updatedAt' | 'createdAt' | 'userId'
>;
