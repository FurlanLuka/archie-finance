import {
  Equals,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  MaxDate,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { DateTime } from 'luxon';
import { KycResponse } from './kyc.interfaces';

export class KycDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @Type(() => Date)
  @MaxDate(DateTime.now().minus({ years: 18, days: 1 }).toJSDate())
  dateOfBirth: Date;

  @IsString()
  addressStreet: string;

  @IsString()
  addressStreetNumber: string;

  @IsString()
  addressLocality: string;

  @IsString()
  addressRegion: string;

  @IsString()
  addressPostalCode: string;

  @IsString()
  addressCountry: string;

  @IsString()
  phoneNumber: string;

  @IsString()
  @Equals('+1')
  phoneNumberCountryCode: string;

  @Transform(({ value }) => `${value}`)
  @IsString()
  @Length(9, 9)
  ssn: string;

  @IsNumber()
  income: number;

  @IsString()
  @IsOptional()
  aptUnit: string | null = null;
}

export class KycResponseDto implements KycResponse {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  addressStreet: string;
  addressStreetNumber: string;
  addressLocality: string;
  addressRegion: string;
  addressPostalCode: string;
  addressCountry: string;
  phoneNumber: string;
  phoneNumberCountryCode: string;
  ssn: string;
  income: number;
  aptUnit: string | null;
  createdAt: string;
}
