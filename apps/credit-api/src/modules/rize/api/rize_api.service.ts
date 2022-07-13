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
} from './rize_api.interfaces';
import { ConfigVariables } from '@archie/api/credit-api/constants';
import * as Auth from '@rizefinance/rize-js/lib/core/auth';
import {
  DEFAULT_BASE_PATH,
  DEFAULT_HOST,
  DEFAULT_TIMEOUT,
} from '@rizefinance/rize-js/lib/constants';
import axios, { AxiosInstance } from 'axios';

@Injectable()
export class RizeApiService {
  private rizeClient: Rize;
  private rizeAuth: Auth;
  private rizeApiClient: AxiosInstance;
  private COMPLIANCE_PLAN_NAME = 'checking';
  private readonly rizeBaseUrl: string;

  constructor(private configService: ConfigService) {
    this.rizeClient = new Rize(
      configService.get(ConfigVariables.RIZE_PROGRAM_ID),
      configService.get(ConfigVariables.RIZE_HMAC_KEY),
      {
        environment: 'integration',
      },
    );
    this.rizeBaseUrl = DEFAULT_HOST[this.rizeClient.environment];
    this.rizeApiClient = this.createApiClient({
      host: this.rizeBaseUrl,
      basePath: DEFAULT_BASE_PATH,
      timeout: DEFAULT_TIMEOUT,
    });
    this.rizeAuth = new Auth(
      configService.get(ConfigVariables.RIZE_PROGRAM_ID),
      configService.get(ConfigVariables.RIZE_HMAC_KEY),
      this.rizeApiClient,
    );
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

    const product: Product = products.data.find(
      (product) => product.compliance_plan_name === this.COMPLIANCE_PLAN_NAME,
    );

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

  public async createAdjustment(
    customerId: string,
    adjustmentAmount: number,
    adjustmentType: string,
  ): Promise<void> {
    const token: string = this.rizeAuth.getToken();
    const adjustements = await this.rizeApiClient.get('adjustment_types', {
      headers: {
        Authorization: token,
      },
    });
    // const adjustements: any = await axios.get(
    //   `${this.rizeBaseUrl}${DEFAULT_BASE_PATH}adjustment_types`,
    //   {
    //     headers: {
    //       Authorization: token,
    //     },
    //   },
    // );
    console.log(token);
    console.log(adjustements.data);

    // await axios.post(
    //   `${this.rizeBaseUrl}${DEFAULT_BASE_PATH}adjustments`,
    //   {},
    //   {
    //     headers: {
    //       Authorization: token,
    //     },
    //   },
    // );
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
}
