import { IsEmail, IsOptional, IsString } from 'class-validator';

export class CreatetDto {
  @IsEmail()
  emailAddress: string;

  @IsOptional()
  @IsString()
  referrer?: string;
}
