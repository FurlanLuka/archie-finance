import { Injectable } from '@nestjs/common';
import axios, { AxiosError, AxiosInstance } from 'axios';
import { ConfigService } from '@archie/api/utils/config';
import { ConfigVariables } from '@archie/api/webhook-api/constants';
import {
  EventsResponse,
  PaymentApplied,
  PeachErrorData,
  PeachErrorResponse,
} from './peach_api.interfaces';

@Injectable()
export class PeachApiService {
  MAX_REQUEST_TIMEOUT = 30000;
  peachClient: AxiosInstance;

  constructor(private configService: ConfigService) {
    this.peachClient = this.createApiClient();
  }

  private createApiClient(): AxiosInstance {
    const axiosInstance: AxiosInstance = axios.create({
      baseURL: this.configService.get(ConfigVariables.PEACH_BASE_URL),
      timeout: this.MAX_REQUEST_TIMEOUT,
      headers: {
        'X-API-KEY': this.configService.get(ConfigVariables.PEACH_API_KEY),
      },
    });

    axiosInstance.interceptors.response.use(undefined, (error: AxiosError) => {
      const response: PeachErrorResponse = {
        config: {
          ...error.config,
          headers: null,
        },
        status: error.response.status,
        errorResponse: <PeachErrorData>error.response.data,
      };

      return Promise.reject(response);
    });

    return axiosInstance;
  }

  public async getPaymentAppliedEvent(
    lastFetchedPaymentEventId: string | null,
  ): Promise<EventsResponse<PaymentApplied>> {
    const response = await this.peachClient.get(`events`, {
      params: {
        events: 'payment.applied',
        limit: 100,
        startingAfter: lastFetchedPaymentEventId ?? undefined,
      },
    });

    return response.data;
  }
}
