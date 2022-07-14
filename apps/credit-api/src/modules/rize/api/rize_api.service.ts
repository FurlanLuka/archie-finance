import { Injectable } from '@nestjs/common';
import { ConfigService } from '@archie-microservices/config';
import Rize from '@rizefinance/rize-js';
import {
  ComplianceDocumentAcknowledgementRequest,
  ComplianceWorkflow,
  Customer,
  CustomerDetails,
  RizeList,
  Product,
  DebitCard,
  DebitCardAccessToken,
  Transaction,
  AdjustmentType,
} from './rize_api.interfaces';
import { ConfigVariables } from '@archie/api/credit-api/constants';
import {
  DEFAULT_BASE_PATH,
  DEFAULT_HOST,
  DEFAULT_TIMEOUT,
} from '@rizefinance/rize-js/lib/constants';
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import * as rs from 'jsrsasign';

@Injectable()
export class RizeApiService {
  private rizeClient: Rize;
  private rizeApiClient: AxiosInstance;
  private readonly rizeBaseUrl: string;

  private DEFAULT_TOKEN_MAX_AGE = 82800000;
  private tokenCache = {
    data: undefined,
    timestamp: undefined,
    isExpired(tokenMaxAge = this.DEFAULT_TOKEN_MAX_AGE) {
      return (
        !this.timestamp || new Date().getTime() - this.timestamp > tokenMaxAge
      );
    },
  };

  constructor(private configService: ConfigService) {
    const environment: 'production' | 'integration' | 'sandbox' =
      configService.get(ConfigVariables.RIZE_ENVIRONMENT);

    this.rizeClient = new Rize(
      configService.get(ConfigVariables.RIZE_PROGRAM_ID),
      configService.get(ConfigVariables.RIZE_HMAC_KEY),
      {
        environment,
      },
    );
    this.rizeBaseUrl = DEFAULT_HOST[environment];
    this.rizeApiClient = this.createApiClient({
      host: this.rizeBaseUrl,
      basePath: DEFAULT_BASE_PATH,
      timeout: DEFAULT_TIMEOUT,
    });
  }

  public async searchCustomers(userId: string): Promise<Customer | null> {
    const customers: RizeList<Customer> =
      await this.rizeClient.customer.getList({
        external_uid: userId,
        include_initiated: true,
      });

    return customers.data[0] ?? null;
  }

  public async createCustomer(userId: string, email: string): Promise<string> {
    const customer: Customer = await this.rizeClient.customer.create(
      userId,
      email,
    );

    return customer.uid;
  }

  public async addCustomerPii(
    customerUid: string,
    email: string,
    customerDetails: CustomerDetails,
  ): Promise<void> {
    await this.rizeClient.customer.update(
      customerUid,
      email,
      customerDetails,
      '',
    );
  }

  public async createCheckingComplianceWorkflow(
    customerId: string,
  ): Promise<ComplianceWorkflow> {
    const products: RizeList<Product> = await this.rizeClient.product.getList();

    const product: Product = products.data[0];

    return this.rizeClient.complianceWorkflow.create(
      customerId,
      product.product_compliance_plan_uid,
    );
  }

  public async acceptComplianceDocuments(
    customerId: string,
    complianceWorkflowUid: string,
    documents: ComplianceDocumentAcknowledgementRequest[],
  ): Promise<ComplianceWorkflow> {
    return this.rizeClient.complianceWorkflow.acknowledgeComplianceDocuments(
      complianceWorkflowUid,
      customerId,
      documents,
    );
  }

  public async getLatestComplianceWorkflow(
    customerId: string,
  ): Promise<ComplianceWorkflow> {
    return this.rizeClient.complianceWorkflow.viewLatest(customerId);
  }

  public async createCustomerProduct(
    customerId: string,
    productId: string,
  ): Promise<void> {
    await this.rizeClient.customerProduct.create(customerId, productId);
  }

  public async createDebitCard(
    userId: string,
    customerId: string,
    poolId,
  ): Promise<DebitCard> {
    return this.rizeClient.debitCard.create(userId, customerId, poolId);
  }

  public async getDebitCard(userId: string): Promise<DebitCard | null> {
    const debitCards: RizeList<DebitCard> =
      await this.rizeClient.debitCard.getList({ external_uid: userId });

    return debitCards.data[0] ?? null;
  }

  public async getDebitCardAccessToken(
    cardID: string,
  ): Promise<DebitCardAccessToken> {
    const debitCardAccessToken: DebitCardAccessToken =
      await this.rizeClient.debitCard.getAccessTokenData(cardID);

    return debitCardAccessToken;
  }

  public async getVirtualCardImage(
    debitCardAccessToken: DebitCardAccessToken,
  ): Promise<string> {
    const virtualCardImage: string =
      await this.rizeClient.debitCard.getVirtualCardImage(
        debitCardAccessToken.config_id,
        debitCardAccessToken.token,
      );

    return virtualCardImage;
  }

  public async getTransactions(
    customerId: string,
    page: number,
    limit: number,
  ): Promise<Transaction[]> {
    const transactions: RizeList<Transaction> =
      await this.rizeClient.transaction.getList({
        customer_uid: [customerId],
        limit: limit,
        offset: page * limit,
        sort: 'created_at_desc',
      });

    return transactions.data;
  }

  public async lockCard(cardId: string): Promise<void> {
    await this.rizeClient.debitCard.lock(cardId, 'Active margin call');
  }

  public async unlockCard(cardId: string): Promise<void> {
    await this.rizeClient.debitCard.unlock(cardId);
  }

  public async loadFunds(
    customerId: string,
    adjustmentAmount: number,
  ): Promise<void> {
    const token: string = await this.getToken();
    const adjustmentTypesResponse: AxiosResponse<AdjustmentType[]> =
      await this.rizeApiClient.get('adjustment_types', {
        headers: {
          Authorization: token,
        },
      });
    const increaseCreditAdjustmentType: AdjustmentType =
      adjustmentTypesResponse.data.find(
        (adjustmentType: AdjustmentType) =>
          adjustmentType.name === 'credit_limit_update_increase',
      );

    await axios.post(
      `${this.rizeBaseUrl}${DEFAULT_BASE_PATH}adjustments`,
      {
        customer_uid: customerId,
        usd_adjustment_amount: adjustmentAmount,
        adjustment_type_uid: increaseCreditAdjustmentType.uid,
      },
      {
        headers: {
          Authorization: token,
        },
      },
    );
  }

  private createApiClient({ host, basePath, timeout }) {
    const axiosInstance = axios.create({
      baseURL: `${host}${basePath}`,
      timeout: timeout,
    });

    axiosInstance.interceptors.response.use(undefined, (err) => {
      throw {
        status: err.response.status,
        statusText: err.response.statusText,
        data: err.response.data,
      };
    });

    return axiosInstance;
  }

  private async getToken() {
    // Check if there's no token data or if the token is already expired
    if (
      !this.tokenCache.data ||
      this.tokenCache.isExpired(this.DEFAULT_TOKEN_MAX_AGE)
    ) {
      // Create Header and Payload objects
      const header = {
        alg: 'HS512',
      };

      const payload = {
        sub: this.configService.get(ConfigVariables.RIZE_PROGRAM_ID),
        iat: Math.floor(+new Date() / 1000),
      };

      // Prep the objects for a JWT
      const sHeader = JSON.stringify(header);
      const sPayload = JSON.stringify(payload);

      // Request for a new token
      const sJwt = rs.KJUR.jws.JWS.sign(
        'HS512',
        sHeader,
        sPayload,
        this.configService.get(ConfigVariables.RIZE_HMAC_KEY),
      );

      let response;
      try {
        response = await this.rizeApiClient.post('/auth', undefined, {
          headers: { Authorization: sJwt },
        });
      } catch (err) {
        return new Error();
      }

      this.tokenCache.data = response.data.token;
      this.tokenCache.timestamp = new Date();
    }
    return this.tokenCache.data;
  }
}
