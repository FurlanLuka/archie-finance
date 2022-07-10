import { IsEmail, IsOptional, IsUUID } from 'class-validator';
import { GetWaitlistRecordResponse } from './waitlist.interfaces';

export class CreateDto {
  @IsEmail()
  emailAddress: string;

  @IsOptional()
  @IsUUID()
  referrer?: string;
}

export class IdParamsDto {
  @IsUUID()
  id: string;
}

export class GetWaitlistRecordResponseDto implements GetWaitlistRecordResponse {
  numberOfReferrals: number;
  numberOfVerifiedReferrals: number;
  waitlistRank: number;
  referralCode: string;
}
