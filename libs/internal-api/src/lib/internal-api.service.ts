import { Inject, Injectable } from '@nestjs/common';
import axios from 'axios';
import { InternalApiConfig } from './internal-api.interfaces';

@Injectable()
export class InternalApiService {
  constructor(
    @Inject('INTERNAL_API_CONFIG') private config: InternalApiConfig,
  ) {}

  public async completeOnboardingStage(
    onboardingStage: string,
    userId: string,
  ): Promise<void> {
    await axios.post(
      `${this.config.internalApiUrl}/internal/onboarding/complete`,
      {
        userId,
        stage: onboardingStage,
      },
    );
  }
}
