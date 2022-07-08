import { IsString } from 'class-validator';

export interface WalletDto {
  userId: string;
  walletId: string;
  name: string;
  createdAt: Date;
}

export class WalletCreateDto {
  @IsString()
  name: string;
}
