export class PaymentInstrumentDto {
  id: string;
  name: string;
  mask: string;
  availableBalance: number;
  currencyISO: string;
  subType: string;
}
