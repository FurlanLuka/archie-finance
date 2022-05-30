import { Inject, Injectable } from '@nestjs/common';
import axios from 'axios';
import { InternalApiConfig } from './internal-api.interfaces';
import { GetAssetPricesResponse } from '@archie-microservices/api-interfaces/asset_price';
import {
  GetCollateralValueResponse,
  GetUserCollateral,
} from '@archie-microservices/api-interfaces/collateral';
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
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
  }

  public async getAssetPrices(): Promise<GetAssetPricesResponse> {
    return axios.get(`${this.config.internalApiUrl}/internal/asset_price`);
  }

  public async getUserCollateralValue(
    userId: string,
  ): Promise<GetCollateralValueResponse> {
    return axios.get(
      `${this.config.internalApiUrl}/internal/collateral/value/${userId}`,
    );
  }

  public async getUserCollateral(userId: string): Promise<GetUserCollateral> {
    return axios.get(
      `${this.config.internalApiUrl}/internal/collateral/${userId}`,
    );
  }
}
