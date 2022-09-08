/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@archie/api/utils/config';
import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import { ConfigVariables, PAYPAL_PAYMENT_CURRENCY } from '@archie/api/paypal-api/constants';
import { URLSearchParams } from 'url';
import {
  CaptureOrderResponse,
  CreateOrderResponse,
} from './paypal_api.interfaces';

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

    this.apiClient.interceptors.request.use(
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

    this.apiClient.defaults.headers.common[
      'Authorization'
    ] = `Bearer ${authenticationResponse.data.access_token}`;
  }

  public async createPaymentOrder(
    paymentIdentifier: string,
    paymentAmount: number,
  ): Promise<CreateOrderResponse> {
    const createOrderResponse: AxiosResponse<CreateOrderResponse> =
      await this.apiClient.post('/v2/checkout/orders', {
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: PAYPAL_PAYMENT_CURRENCY,
              value: paymentAmount,
            },
            custom_id: paymentIdentifier,
            description: 'Credit line payment',
          },
        ],
        application_context: {
          brand_name: 'Archie Finance',
          payment_method: {
            payee_preferred: 'IMMEDIATE_PAYMENT_REQUIRED',
          },
          shipping_preference: 'NO_SHIPPING',
          landing_page: 'BILLING',
          user_action: 'PAY_NOW',
          return_url: this.configService.get(ConfigVariables.PAYPAL_RETURN_URL),
        },
      });

    return createOrderResponse.data;
  }

  public async captureOrder(orderId: string): Promise<CaptureOrderResponse> {
    const captureOrderResponse: AxiosResponse<CaptureOrderResponse> =
      await this.apiClient.post(`/v2/checkout/orders/${orderId}/capture`, {});

    return captureOrderResponse.data;
  }
}
