import { IsString } from 'class-validator';
import { GetOnboardingResponse } from './onboarding.interfaces';

export class CompleteOnboardingStageDto {
  @IsString()
  userId: string;
}

export class GetOnboardingResponseDto implements GetOnboardingResponse {
  kycStage: boolean;
  emailVerificationStage: boolean;
  collateralizationStage: boolean;
  cardActivationStage: boolean;
  completed: boolean;
}
