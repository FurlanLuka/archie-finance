import { Inject, Injectable, Logger } from '@nestjs/common';
import axios, { AxiosError } from 'axios';
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
    try {
      await axios.post(
        `${this.config.internalApiUrl}/internal/onboarding/complete`,
        {
          userId,
          stage: onboardingStage,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
    } catch (error) {
      Logger.error(JSON.stringify(error));
      Logger.error((error as AxiosError).toJSON());
    }
  }
}
