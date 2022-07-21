import { Inject, Injectable } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';
import { InternalApiConfig } from './internal-api.interfaces';
import { GetAssetPricesResponse } from '@archie/api/utils/interfaces/asset_price';
import {
  GetCollateralValueResponse,
  GetUserCollateral,
} from '@archie/api/utils/interfaces/collateral';
import {
  GetAssetInformationResponse,
  GetAssetListResponse,
} from '@archie/api/utils/interfaces/asset_information';
import { GetKycResponse } from '@archie/api/utils/interfaces/kyc';
import { GetEmailAddressResponse } from '@archie/api/utils/interfaces/user';

@Injectable()
export class InternalApiService {
  constructor(
    @Inject('INTERNAL_API_CONFIG') private config: InternalApiConfig,
  ) {}

  public async getKyc(userId: string): Promise<GetKycResponse> {
    const response: AxiosResponse<GetKycResponse> = await axios.get(
      `${this.config.internalApiUrl}/internal/kyc/${userId}`,
    );

    return response.data;
  }

  public async getAssetList(): Promise<GetAssetListResponse> {
    const response: AxiosResponse<GetAssetListResponse> = await axios.get(
      `${this.config.internalApiUrl}/internal/asset_information`,
    );

    return response.data;
  }

  public async getAssetInformation(
    asset: string,
  ): Promise<GetAssetInformationResponse> {
    const response: AxiosResponse<GetAssetInformationResponse> =
      await axios.get(
        `${this.config.internalApiUrl}/internal/asset_information/${asset}`,
      );

    return response.data;
  }

  public async getAssetPrices(): Promise<GetAssetPricesResponse> {
    const response: AxiosResponse<GetAssetPricesResponse> = await axios.get(
      `${this.config.internalApiUrl}/internal/asset_price`,
    );

    return response.data;
  }

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
