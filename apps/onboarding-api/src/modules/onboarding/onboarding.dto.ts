import { IsString } from 'class-validator';
import { OnboardingStage } from './onboarding.interfaces';

export class OnboardingDto {
  @IsString()
  stage: OnboardingStage;
}
