import { IsString } from 'class-validator';
import { GetOnboardingResponse } from './onboarding.interfaces';

export class OnboardingDto {
  @IsString()
  stage: string;

  @IsString()
  userId: string;
}

export class GetOnboardingResponseDto implements GetOnboardingResponse {
  kycStage: boolean;
  emailVerificationStage: boolean;
  phoneVerificationStage: boolean;
  collateralizationStage: boolean;
  cardActivationStage: boolean;
  completed: boolean;
}
