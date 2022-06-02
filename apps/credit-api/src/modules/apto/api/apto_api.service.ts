import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@archie-microservices/config';
import {
  AddressDataPoint,
  BirthdateDataPoint,
  CardApplicationResponse,
  CompleteVerificationResponse,
  CreateUserResponse,
  EmailDataPoint,
  IdDocumentDataPoint,
  NameDataPoint,
  PhoneDataPoint,
  StartVerificationResponse,
} from './apto_api.interfaces';
import axios, { AxiosError, AxiosRequestHeaders, AxiosResponse } from 'axios';
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
    try {
      const response: AxiosResponse<StartVerificationResponse> =
        await axios.post(
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
    } catch (error) {
      Logger.error({
        code: 'ERROR_STARTING_VERIFICATION_PROCESS',
        metadata: {
          error: (error as AxiosError).toJSON(),
        },
      });

      throw new InternalServerErrorException();
    }
  }

  public async restartVerificationProcess(
    verificationId: string,
  ): Promise<StartVerificationResponse> {
    try {
      const response: AxiosResponse<StartVerificationResponse> =
        await axios.post(
          this.constructAptoUrl(`/v1/verifications/${verificationId}/restart`),
          {},
          {
            headers: this.getAptoHeaders(),
          },
        );

      return response.data;
    } catch (error) {
      Logger.error({
        code: 'ERROR_RESTARTING_VERIFICATION_PROCESS',
        metadata: {
          error: (error as AxiosError).toJSON(),
        },
      });

      throw new InternalServerErrorException();
    }
  }

  public async completeVerificationProcess(
    verificationId: string,
    secret: string,
  ): Promise<CompleteVerificationResponse> {
    try {
      const response: AxiosResponse<CompleteVerificationResponse> =
        await axios.post(
          this.constructAptoUrl(`/v1/verifications/${verificationId}/finish`),
          {
            secret: secret,
          },
          {
            headers: this.getAptoHeaders(),
          },
        );

      return response.data;
    } catch (error) {
      Logger.error({
        code: 'ERROR_COMPLETING_VERIFICATION_PROCESS',
        metadata: {
          error: (error as AxiosError).toJSON(),
        },
      });

      throw new InternalServerErrorException();
    }
  }

  public async createUser(
    userId: string,
    phoneDataPoint: PhoneDataPoint,
    emailDataPoint: EmailDataPoint,
    birthdateDataPoint: BirthdateDataPoint,
    nameDataPoint: NameDataPoint,
    addressDataPoint: AddressDataPoint,
    idDocumentDataPoint: IdDocumentDataPoint,
  ): Promise<CreateUserResponse> {
    try {
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
              idDocumentDataPoint,
            ],
            has_more: false,
            page: 0,
            rows: 1,
            total_count: 1,
          },
        },
        {
          headers: this.getAptoHeaders(),
        },
      );

      return response.data;
    } catch (error) {
      Logger.error({
        code: 'ERROR_CREATING_APTO_USER',
        metadata: {
          error: (error as AxiosError).toJSON(),
        },
      });

      throw new InternalServerErrorException();
    }
  }

  public async applyForCardPrograme(
    userAccessToken: string,
    cardProgrameId: string,
  ): Promise<CardApplicationResponse> {
    try {
      const response: AxiosResponse<CardApplicationResponse> = await axios.post(
        this.constructAptoUrl(`/v1/user/accounts/apply`),
        {
          card_product_id: cardProgrameId,
        },
        {
          headers: {
            ...this.getAptoHeaders(),
            Authorization: `Bearer ${userAccessToken}`,
          },
        },
      );

      return response.data;
    } catch (error) {
      Logger.error({
        code: 'ERROR_CREATING_APTO_USER',
        metadata: {
          error: (error as AxiosError).toJSON(),
        },
      });

      throw new InternalServerErrorException();
    }
  }
}
