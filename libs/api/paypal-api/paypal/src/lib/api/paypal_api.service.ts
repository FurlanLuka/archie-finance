/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@archie/api/utils/config';
import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import { ConfigVariables } from '@archie/api/paypal-api/constants';
import { URLSearchParams } from 'url';

interface AuthenticationResponse {
  scope: string;
  access_token: string;
  token_type: string;
  app_id: string;
  expires_in: number;
  nonce: string;
}

@Injectable()
export class PaypalApiService {
  private apiClient: AxiosInstance;

  constructor(private configService: ConfigService) {
    this.apiClient = axios.create({
      baseURL: configService.get(ConfigVariables.PAYPAL_API_URL),
    });

    console.log('herere');

    this.apiClient.interceptors.response.use(
      undefined,
      async (error: AxiosError) => {
        if (error.response?.status === 401) {
          try {
            await this.authenticate();

            // eslint-disable-next-line @typescript-eslint/return-await
            return this.apiClient(error.config);
          } catch (authenticationError) {
            Logger.log('AXIOS_AUTHENTICATION_ERROR');

            return Promise.reject(authenticationError);
          }
        }
      },
    );

    void this.authenticate();
  }

  private async authenticate(): Promise<void> {
    const authenticationResponse: AxiosResponse<AuthenticationResponse> =
      await this.apiClient.post(
        '/v1/oauth2/token',
        new URLSearchParams({
          grant_type: 'client_credentials',
        }),
        {
          auth: {
            username: this.configService.get(ConfigVariables.PAYPAL_CLIENT_ID),
            password: this.configService.get(
              ConfigVariables.PAYPAL_CLIENT_SECRET,
            ),
          },
        },
      );

    this.apiClient.defaults.headers.common['Authorization'] =
      authenticationResponse.data.access_token;
  }

  // private createApiClient(): AxiosInstance {
  //   const axiosInstance: AxiosInstance = axios.create({
  //     baseURL: this.configService.get(ConfigVariables.PEACH_BASE_URL),
  //     timeout: this.MAX_REQUEST_TIMEOUT,
  //     headers: {
  //       'X-API-KEY': this.configService.get(ConfigVariables.PEACH_API_KEY),
  //     },
  //   });

  //   axiosInstance.interceptors.response.use(undefined, (error: AxiosError) => {
  //     const response: PeachErrorResponse = {
  //       config: {
  //         ...error.config,
  //         headers: null,
  //       },
  //       status: (<AxiosResponse>error.response).status,
  //       errorResponse: <PeachErrorData>error.response?.data,
  //     };
  //     Logger.error(JSON.stringify(response, null, 2));

  //     return Promise.reject(response);
  //   });

  //   return axiosInstance;
  // }
}
