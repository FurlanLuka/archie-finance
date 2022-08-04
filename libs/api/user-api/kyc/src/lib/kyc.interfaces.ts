import { Transform, Type } from 'class-transformer';
import { Equals, IsString, Length, MaxDate } from 'class-validator';
import { DateTime } from 'luxon';

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

export class GetKycResponse {
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
  createdAt: Date;
}

export class CreateKycResponse extends GetKycResponse {}

export class GetKycPayload {
  userId: string;
}

export class KycSubmittedPayload extends KycDto {
  userId: string;
}
