import { IsEmail, IsOptional, IsUUID } from 'class-validator';

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
