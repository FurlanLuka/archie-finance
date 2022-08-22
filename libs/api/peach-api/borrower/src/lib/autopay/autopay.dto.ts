import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Matches,
} from 'class-validator';
import { PEACH_ID_REGEX } from '../utils/validation';
import { AutopayOptions } from '../api/peach_api.interfaces';

export enum AmountType {
  statementMinimumAmount = 'statementMinimumAmount',
  statementMinimumAmountPlusExtra = 'statementMinimumAmountPlusExtra',
  statementBalanceAmount = 'statementBalanceAmount',
}

export class CreateAutopayDto implements AutopayOptions {
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

export class CreateAutopayDocumentDto {
  @Matches(PEACH_ID_REGEX)
  paymentInstrumentId: string;
}

export class AutopayAgreementDto {
  id: string;
  document: string;
}
