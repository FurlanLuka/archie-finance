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
  CardBalanceResponse,
  CompleteVerificationResponse,
  CreateUserResponse,
  EmailDataPoint,
  IdDocumentDataPoint,
  IssueCardResponse,
  NameDataPoint,
  PhoneDataPoint,
  StartVerificationResponse,
} from './apto_api.interfaces';
import axios, { AxiosError, AxiosRequestHeaders, AxiosResponse } from 'axios';
import { ConfigVariables } from '../../../interfaces';
import { CryptoService } from '@archie-microservices/crypto';

@Injectable()
export class AptoApiService {
  constructor(
    private configService: ConfigService,
    private cryptoService: CryptoService,
  ) {}

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

  private getAptoBasicAuthHeaders(): AxiosRequestHeaders {
    return {
      Authorization: `Basic ${this.cryptoService.base64encode(
        `${this.configService.get(
          ConfigVariables.APTO_PUBLIC_KEY,
        )}:${this.configService.get(ConfigVariables.APTO_PRIVATE_KEY)}`,
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
      const axiosError: AxiosError = error;

      Logger.error({
        code: 'ERROR_STARTING_VERIFICATION_PROCESS',
        metadata: {
          error: axiosError.toJSON(),
          errorResponse: axiosError.response,
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
      const axiosError: AxiosError = error;

      Logger.error({
        code: 'ERROR_RESTARTING_VERIFICATION_PROCESS',
        metadata: {
          error: axiosError.toJSON(),
          errorResponse: axiosError.response,
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
      const axiosError: AxiosError = error;

      Logger.error({
        code: 'ERROR_COMPLETING_VERIFICATION_PROCESS',
        metadata: {
          error: axiosError.toJSON(),
          errorResponse: axiosError.response,
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
      const axiosError: AxiosError = error;

      Logger.error({
        code: 'ERROR_CREATING_APTO_USER',
        metadata: {
          error: axiosError.toJSON(),
          errorResponse: axiosError.response,
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
      const axiosError: AxiosError = error;

      Logger.error({
        code: 'ERROR_CREATING_APTO_USER',
        metadata: {
          error: axiosError.toJSON(),
          errorResponse: axiosError.response,
        },
      });

      throw new InternalServerErrorException();
    }
  }

  public async getCardApplication(
    userAccessToken: string,
    applicationId: string,
  ): Promise<CardApplicationResponse> {
    try {
      const response: AxiosResponse<CardApplicationResponse> = await axios.get(
        this.constructAptoUrl(
          `/v1/user/accounts/applications/${applicationId}/status`,
        ),
        {
          headers: {
            ...this.getAptoHeaders(),
            Authorization: `Bearer ${userAccessToken}`,
          },
        },
      );

      return response.data;
    } catch (error) {
      const axiosError: AxiosError = error;

      Logger.error({
        code: 'ERROR_GETTING_CARD_APPLICATION',
        metadata: {
          error: axiosError.toJSON(),
          errorResponse: axiosError.response,
        },
      });

      throw new InternalServerErrorException();
    }
  }

  public async setAgreementStatus(userAccessToken: string): Promise<void> {
    try {
      await axios.post(
        this.constructAptoUrl(`/v1/agreements`),
        {
          agreements_keys: [
            'evolve_eua',
            'evolve_privacy',
            'apto_cha',
            'apto_privacy',
          ],
          user_action: 'ACCEPTED',
        },
        {
          headers: {
            ...this.getAptoHeaders(),
            Authorization: `Bearer ${userAccessToken}`,
          },
        },
      );
    } catch (error) {
      const axiosError: AxiosError = error;

      Logger.error({
        code: 'ERROR_SETTING_APTO_AGREEMENTS',
        metadata: {
          error: axiosError.toJSON(),
          errorResponse: axiosError.response,
        },
      });

      throw new InternalServerErrorException();
    }
  }

  public async acceptAgreements(
    userAccessToken: string,
    workflowObjectId: string,
    actionId: string,
  ): Promise<void> {
    try {
      await axios.post(
        this.constructAptoUrl(`/v1/disclaimers/accept`),
        {
          workflow_object_id: workflowObjectId,
          action_id: actionId,
        },
        {
          headers: {
            ...this.getAptoHeaders(),
            Authorization: `Bearer ${userAccessToken}`,
          },
        },
      );
    } catch (error) {
      const axiosError: AxiosError = error;

      Logger.error({
        code: 'ERROR_ACCEPTING_APTO_AGREEMENTS',
        metadata: {
          error: axiosError.toJSON(),
          errorResponse: axiosError.response,
        },
      });

      throw new InternalServerErrorException();
    }
  }

  public async issueCard(
    userAccessToken: string,
    applicationId: string,
  ): Promise<IssueCardResponse> {
    try {
      const response: AxiosResponse<IssueCardResponse> = await axios.post(
        this.constructAptoUrl(`/v1/user/accounts/issuecard`),
        {
          application_id: applicationId,
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
      const axiosError: AxiosError = error;

      Logger.error({
        code: 'ERROR_ACCEPTING_APTO_AGREEMENTS',
        metadata: {
          error: axiosError.toJSON(),
          errorResponse: axiosError.response,
        },
      });

      throw new InternalServerErrorException();
    }
  }

  public async getCardBalance(
    userAccessToken: string,
    cardId: string,
  ): Promise<CardBalanceResponse> {
    try {
      const response: AxiosResponse<CardBalanceResponse> = await axios.get(
        this.constructAptoUrl(`/v1/user/accounts/${cardId}/balance`),
        {
          headers: {
            ...this.getAptoHeaders(),
            Authorization: `Bearer ${userAccessToken}`,
          },
        },
      );

      return response.data;
    } catch (error) {
      const axiosError: AxiosError = error;

      Logger.error({
        code: 'ERROR_GETTING_CARD_BALANCE',
        metadata: {
          error: axiosError.toJSON(),
          errorResponse: axiosError.response,
        },
      });

      throw new InternalServerErrorException();
    }
  }

  public async loadFunds(
    cardId: string,
    amount: number,
  ): Promise<void> {
    try {
      await axios.post(
        this.constructAptoUrl(`/cards/${cardId}/load_funds`),
        {
          amount: {
            currency: 'USD',
            amount,
          },
          source_balance_id: this.configService.get(ConfigVariables.APTO_FUNDING_BALANCE_ID),
        },
        {
          headers: {
            ...this.getAptoBasicAuthHeaders(),
          },
        },
      );
    } catch (error) {
      const axiosError: AxiosError = error;

      Logger.error({
        code: 'ERROR_LOADING_FUNDS',
        metadata: {
          error: axiosError.toJSON(),
          errorResponse: axiosError.response,
        },
      });

      throw new InternalServerErrorException();
    }
  }
}
