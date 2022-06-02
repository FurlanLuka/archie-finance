import { IsString } from 'class-validator';

export class FinishPhoneVerificationDto {
  @IsString()
  secret: string;
}
