import { IsEmail, IsString } from 'class-validator';

export class SalesConnectDto {
  @IsEmail()
  emailAddress: string;

  @IsString()
  fullName: string;

  @IsString()
  company: string;
}
