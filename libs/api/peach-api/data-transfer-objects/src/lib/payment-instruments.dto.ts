import { IsString } from 'class-validator';
import {
  ConnectAccountBody,
  PaymentInstrument,
} from './payment-instruments.interfaces';

export class PaymentInstrumentDto implements PaymentInstrument {
  id: string;
  name: string;
  mask: string;
  subType: string;
}

export class ConnectAccountDto implements ConnectAccountBody {
  @IsString()
  accountId: string;

  @IsString()
  publicToken: string;
}
