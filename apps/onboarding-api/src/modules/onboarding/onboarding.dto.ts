import { IsString } from 'class-validator';
import * as i from './onboarding.interfaces';

export class OnboardingDto {
  @IsString()
  stage: string;

  @IsString()
  userId: string;
}

export class GetOnboardingResponse implements i.GetOnboardingResponse {
  kycStage: boolean;
  emailVerificationStage: boolean;
  phoneVerificationStage: boolean;
  collateralizationStage: boolean;
  cardActivationStage: boolean;
  completed: boolean;
}
