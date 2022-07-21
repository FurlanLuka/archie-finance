import { Transform, Type } from 'class-transformer';
import { Equals, IsString, Length, MaxDate } from 'class-validator';
import { DateTime } from 'luxon';
import {
  CreateKycResponse,
  GetKycResponse,
} from '@archie/api/utils/interfaces/kyc';

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
}

export class GetKycResponseDto implements GetKycResponse {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  addressStreet: string;
  addressStreetNumber: string;
  addressLocality: string;
  addressCountry: string;
  addressRegion: string;
  addressPostalCode: string;
  phoneNumberCountryCode: string;
  phoneNumber: string;
  ssn: string;
}

export class CreateKycResponseDto
  extends GetKycResponseDto
  implements CreateKycResponse {}
