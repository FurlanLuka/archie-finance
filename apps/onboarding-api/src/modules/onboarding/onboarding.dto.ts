import { IsString } from 'class-validator';

export class OnboardingDto {
  @IsString()
  stage: string;

  @IsString()
  userId: string;
}
