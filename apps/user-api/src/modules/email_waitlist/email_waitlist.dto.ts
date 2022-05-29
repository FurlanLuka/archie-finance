import { IsEmail } from 'class-validator';

export class EmailWaitlistDto {
  @IsEmail()
  emailAddress: string;
}
