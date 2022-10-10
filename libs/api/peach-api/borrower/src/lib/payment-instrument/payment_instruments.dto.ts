import { IsString } from 'class-validator';

export class PaymentInstrumentDto {
  id: string;
  name: string;
  mask: string;
  subType: string;
}

export class ConnectAccountDto {
  @IsString()
  accountId: string;

  @IsString()
  publicToken: string;
}
