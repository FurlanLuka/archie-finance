import { Kyc } from './kyc.entity';

export type GetKycResponse = Omit<Kyc, 'userId' | 'createdAt' | 'updatedAt'>;
export type CreateKycResponse = GetKycResponse;
