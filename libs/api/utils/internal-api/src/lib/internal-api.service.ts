import { Inject, Injectable } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';
import { InternalApiConfig } from './internal-api.interfaces';
import {
  GetCollateralValueResponse,
  GetUserCollateral,
} from '@archie/api/utils/interfaces/collateral';
import { GetEmailAddressResponse } from '@archie/api/utils/interfaces/user';

@Injectable()
export class InternalApiService {
  constructor(
    @Inject('INTERNAL_API_CONFIG') private config: InternalApiConfig,
  ) {}

  public async getUserCollateralValue(
    userId: string,
  ): Promise<GetCollateralValueResponse> {
    const response: AxiosResponse<GetCollateralValueResponse> = await axios.get(
      `${this.config.internalApiUrl}/internal/collateral/value/${userId}`,
    );

    return response.data;
  }

  public async getUserCollateral(userId: string): Promise<GetUserCollateral> {
    const response: AxiosResponse<GetUserCollateral> = await axios.get(
      `${this.config.internalApiUrl}/internal/collateral/${userId}`,
    );

    return response.data;
  }

  public async getUserEmailAddress(
    userId: string,
  ): Promise<GetEmailAddressResponse> {
    const response: AxiosResponse<GetEmailAddressResponse> = await axios.get(
      `${this.config.internalApiUrl}/internal/user/email-address/${userId}`,
    );

    return response.data;
  }
}
