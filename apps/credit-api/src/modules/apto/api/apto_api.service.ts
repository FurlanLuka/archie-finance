import { Injectable } from '@nestjs/common';
import { ConfigService } from '@archie-microservices/config';
import {
  AddressDataPoint,
  BirthdateDataPoint,
  CompleteVerificationResponse,
  CreateUserResponse,
  EmailDataPoint,
  NameDataPoint,
  PhoneDataPoint,
  StartVerificationResponse,
} from '../apto.interfaces';
import axios, { AxiosRequestHeaders, AxiosResponse } from 'axios';
import { ConfigVariables } from '../../../interfaces';

@Injectable()
export class AptoApiService {
  constructor(private configService: ConfigService) {}

  private constructAptoUrl(path: string): string {
    return `${this.configService.get(ConfigVariables.APTO_API_URL)}${path}`;
  }

  private getAptoHeaders(): AxiosRequestHeaders {
    return {
      'Api-Key': `Bearer ${this.configService.get(
        ConfigVariables.APTO_API_KEY,
      )}`,
    };
  }

  public async startVerificationProcess(
    countryCode: string,
    phoneNumber: string,
  ): Promise<StartVerificationResponse> {
    const response: AxiosResponse<StartVerificationResponse> = await axios.post(
      this.constructAptoUrl(`/v1/verifications/start`),
      {
        datapoint_type: 'phone',
        datapoint: {
          data_type: 'phone',
          country_code: countryCode,
          phone_number: phoneNumber,
        },
      },
      {
        headers: this.getAptoHeaders(),
      },
    );

    return response.data;
  }

  public async restartVerificationProcess(
    verificationId: string,
  ): Promise<StartVerificationResponse> {
    const response: AxiosResponse<StartVerificationResponse> = await axios.post(
      this.constructAptoUrl(`/v1/verifications/${verificationId}/restart`),
      {},
      {
        headers: this.getAptoHeaders(),
      },
    );

    return response.data;
  }

  public async completeVerificationProcess(
    verificationId: string,
    secret: string,
  ): Promise<CompleteVerificationResponse> {
    const response: AxiosResponse<CompleteVerificationResponse> =
      await axios.post(
        this.constructAptoUrl(`/v1/verifications/${verificationId}/finish`),
        {
          secret,
        },
        {
          headers: this.getAptoHeaders(),
        },
      );

    return response.data;
  }

  public async createUser(
    userId: string,
    phoneDataPoint: PhoneDataPoint,
    emailDataPoint: EmailDataPoint,
    birthdateDataPoint: BirthdateDataPoint,
    nameDataPoint: NameDataPoint,
    addressDataPoint: AddressDataPoint,
  ): Promise<CreateUserResponse> {
    const response: AxiosResponse<CreateUserResponse> = await axios.post(
      this.constructAptoUrl(`/v1/user`),
      {
        custodian_id: userId,
        data_points: {
          type: 'list',
          data: [
            phoneDataPoint,
            emailDataPoint,
            birthdateDataPoint,
            nameDataPoint,
            addressDataPoint,
          ],
        },
      },
      {
        headers: this.getAptoHeaders(),
      },
    );

    return response.data;
  }
}
