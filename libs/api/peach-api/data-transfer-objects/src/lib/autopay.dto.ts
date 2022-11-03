import { IsBoolean, IsEnum, IsNumber, IsOptional, IsPositive, IsString, Matches } from 'class-validator';
import { AmountType, PaymentFrequency } from './peach-api.interfaces';
import { AutopayAgreement, AutopayResponse, CreateAutopay, CreateAutopayDocument } from './autopay.interfaces';

// TODO solve this and peach-api/constants circular dependency
const PEACH_ID_REGEX = /^ext-|^[A-Z]{2}-[A-Z0-9]+-[A-Z0-9]+|^\d+$/;

export class CreateAutopayDto implements CreateAutopay {
  @IsEnum(AmountType)
  amountType: AmountType;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  extraAmount?: number | null;

  @Matches(PEACH_ID_REGEX)
  paymentInstrumentId: string;

  @IsBoolean()
  isAlignedToDueDates: boolean;

  @IsNumber({}, { each: true })
  @IsOptional()
  offsetFromDueDate?: number[] | null;

  @IsString()
  agreementDocumentId: string;
}

export class CreateAutopayDocumentDto implements CreateAutopayDocument {
  @Matches(PEACH_ID_REGEX)
  paymentInstrumentId: string;
}

export class AutopayAgreementDto implements AutopayAgreement {
  id: string;
  document: string;
}

export class AutopayDto implements AutopayResponse {
  type: AmountType;
  extraAmount: number;
  isAlignedToDueDates: boolean;
  paymentFrequency: PaymentFrequency;
  paymentInstrumentId: string;
  cancelReason: string;
  schedule: AutopaySchedule[];
}

export class AutopaySchedule {
  date: string;
  paymentType: string;
  status: string;
  amount: number;
  originalAmount: number;
  principalAmount: number;
  interestAmount: number;
}
