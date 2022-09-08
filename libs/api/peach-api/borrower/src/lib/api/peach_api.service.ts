import { Injectable, Logger } from '@nestjs/common';
import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import { ConfigService } from '@archie/api/utils/config';
import { ConfigVariables } from '@archie/api/peach-api/constants';
import {
  CreditLimit,
  CreditLine,
  Draw,
  HomeAddress,
  IdentityType,
  Credit,
  PaymentInstrument,
  PeachErrorData,
  PeachErrorResponse,
  PeachTransactionStatus,
  PeachTransactionType,
  Person,
  PersonStatus,
  Obligations,
  PaymentInstrumentBalance,
  Payments,
  QueryParams,
  Purchases,
  Balances,
  PeachResponseData,
  PeachOneTimePaymentStatus,
} from './peach_api.interfaces';
import { Borrower } from '../borrower.entity';
import {
  PaymentInstrumentNotFoundError,
  AmountExceedsOutstandingBalanceError,
} from '../borrower.errors';
import { omitBy, isNil } from 'lodash';
import { KycSubmittedPayload } from '@archie/api/user-api/data-transfer-objects';
import { TransactionUpdatedPayload } from '@archie/api/credit-api/data-transfer-objects';

@Injectable()
export class PeachApiService {
  MAX_REQUEST_TIMEOUT = 10000;
  CONTACT_ALREADY_EXISTS_STATUS = 400;
  ALREADY_ACTIVATED_STATUS = 400;
  USER_ALREADY_EXISTS_STATUS = 409;
  NOMINAL_APR = 0;
  EFFECTIVE_APR = 0.16;

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
        status: (<AxiosResponse>error.response).status,
        errorResponse: <PeachErrorData>error.response?.data,
      };
      Logger.error(JSON.stringify(response, null, 2));

      return Promise.reject(response);
    });

    return axiosInstance;
  }

  public async createLiquidationPaymentInstrument(
    personId: string,
  ): Promise<PaymentInstrument> {
    const response = await this.peachClient.post(
      `/people/${personId}/payment-instruments`,
      {
        status: 'active',
        instrumentType: 'paymentNetwork',
        paymentNetworkName: 'Fireblocks internal transaction',
      },
    );

    return response.data.data[0];
  }

  public async createPlaidPaymentInstrument(
    personId: string,
    accountId: string,
    publicToken: string,
    fullName: string,
  ): Promise<PaymentInstrument> {
    const response = await this.peachClient.post(
      `/people/${personId}/payment-instruments`,
      {
        instrumentType: 'plaid',
        accessToken: publicToken,
        accountIds: [accountId],
        accountHolderType: 'personal',
        accountHolderName: fullName,
      },
    );

    return response.data.data[0];
  }

  public async createPaypalPaymentInstrument(
    personId: string,
  ): Promise<PaymentInstrument> {
    const response = await this.peachClient.post(
      `/people/${personId}/payment-instruments`,
      {
        instrumentType: 'paymentNetwork',
        paymentNetworkName: 'PayPal',
        status: 'active',
      },
    );

    return response.data.data[0];
  }

  public async deletePaymentInstrument(
    personId: string,
    paymentInstrumentId: string,
  ): Promise<void> {
    await this.peachClient.delete(
      `/people/${personId}/payment-instruments/${paymentInstrumentId}`,
    );
  }

  public async createOneTimePaymentTransaction(
    borrower: Borrower,
    paymentInstrumentId: string,
    amount: number,
    externalId: string,
    status: PeachOneTimePaymentStatus
  ): Promise<void> {
    try {
      await this.peachClient.post(
        `/people/${borrower.personId}/loans/${borrower.creditLineId}/transactions`,
        {
          externalId,
          type: 'oneTime',
          drawId: borrower.drawId,
          isExternal: true,
          status,
          paymentInstrumentId,
          amount,
        },
      );
    } catch (e) {
      const error: PeachErrorResponse = e;
      this.ignoreDuplicatedEntityError(error);
    }
  }

  public async completeTransaction(
    borrower: Borrower,
    externalId: string,
  ): Promise<void> {
    await this.peachClient.put(
      `/people/${borrower.personId}/loans/${borrower.creditLineId}/transactions/ext-${externalId}`,
      {
        status: 'succeeded',
      },
    );
  }

  public async createPerson(kyc: KycSubmittedPayload): Promise<Person> {
    const response = await this.peachClient.post('/people', {
      externalId: kyc.userId,
      status: PersonStatus.active,
      name: {
        firstName: kyc.firstName,
        lastName: kyc.lastName,
      },
      dateOfBirth: kyc.dateOfBirth,
      identity: {
        identityType: IdentityType.SSN,
        value: kyc.ssn,
      },
    });

    return response.data.data;
  }

  public async addHomeAddressContact(
    personId: string,
    kyc: KycSubmittedPayload,
  ): Promise<HomeAddress> {
    const response = await this.peachClient.post(
      `/people/${personId}/contacts`,
      {
        contactType: 'address',
        label: 'home',
        affiliation: 'self',
        status: 'primary',
        address: {
          addressLine1: `${kyc.addressStreetNumber} ${kyc.addressStreet}`,
          city: kyc.addressLocality,
          state: kyc.addressRegion,
          postalCode: kyc.addressPostalCode,
          country: kyc.addressCountry,
        },
      },
    );

    return response.data.data;
  }

  public async addMobilePhoneContact(
    personId: string,
    kyc: KycSubmittedPayload,
  ): Promise<void> {
    try {
      await this.peachClient.post(`/people/${personId}/contacts`, {
        contactType: 'phone',
        label: 'personal',
        affiliation: 'self',
        status: 'primary',
        value: `${kyc.phoneNumberCountryCode}${kyc.phoneNumber}`,
        valid: true,
        verified: false,
        receiveTextMessages: false,
      });
    } catch (error) {
      const axiosError: PeachErrorResponse = error;

      if (axiosError.status !== this.CONTACT_ALREADY_EXISTS_STATUS) throw error;
    }
  }

  public async addMailContact(personId: string, email: string): Promise<void> {
    await this.peachClient.post(`/people/${personId}/contacts`, {
      contactType: 'email',
      label: 'personal',
      affiliation: 'self',
      status: 'primary',
      value: email,
      valid: true,
      verified: true,
    });
  }

  public async createUser(personId: string, email: string): Promise<void> {
    try {
      await this.peachClient.post(
        `/companies/${this.configService.get(
          ConfigVariables.PEACH_COMPANY_ID,
        )}/users`,
        {
          userType: 'borrower',
          authType: {
            email,
          },
          roles: [
            this.configService.get(ConfigVariables.PEACH_BORROWER_ROLE_ID),
          ],
          associatedPersonId: personId,
        },
      );
    } catch (error) {
      const axiosError: PeachErrorResponse = error;

      if (axiosError.status !== this.USER_ALREADY_EXISTS_STATUS) throw error;
    }
  }

  public async createCreditLine(
    personId: string,
    creditLimit: number,
    addressContactId: string,
    downPaymentAmount: number,
  ): Promise<CreditLine> {
    const response = await this.peachClient.post(`/people/${personId}/loans`, {
      loanTypeId: this.configService.get(ConfigVariables.PEACH_LOAN_ID),
      type: 'lineOfCredit',
      // TODO: check if ok
      servicedBy: 'creditor',
      status: 'originated',
      newDrawsAllowed: true,
      atOrigination: {
        interestRates: [{ days: null, rate: 0 }],
        paymentFrequency: 'monthly',
        // TODO: check if ok
        originationLicense: 'nationalBank',
        // TODO: check if ok
        originatingCreditorName: 'Bank of Mars',
        aprNominal: this.NOMINAL_APR,
        aprEffective: this.EFFECTIVE_APR,
        creditLimitAmount: creditLimit,
        downPaymentAmount,
        personAddressId: addressContactId,
      },
    });

    return response.data.data;
  }

  public async getCreditLine(
    personId: string,
    loanId: string,
  ): Promise<CreditLine> {
    const response = await this.peachClient.get<PeachResponseData<CreditLine>>(
      `/people/${personId}/loans/${loanId}`,
    );

    return response.data.data;
  }

  public async getCreditLimit(
    personId: string,
    loanId: string,
  ): Promise<CreditLimit> {
    const response = await this.peachClient.get(
      `/people/${personId}/loans/${loanId}/credit-limit`,
    );

    return response.data.data;
  }
  public async updateCreditLimit(
    personId: string,
    loanId: string,
    newAmount: number,
  ): Promise<CreditLimit> {
    const response = await this.peachClient.post(
      `/people/${personId}/loans/${loanId}/credit-limit`,
      {
        creditLimitAmount: newAmount,
      },
    );

    return response.data.data;
  }

  public async activateCreditLine(
    personId: string,
    loanId: string,
  ): Promise<void> {
    try {
      await this.peachClient.post(
        `/people/${personId}/loans/${loanId}/activate`,
        {},
      );
    } catch (error) {
      const axiosError: PeachErrorResponse = error;

      if (axiosError.status !== this.ALREADY_ACTIVATED_STATUS) throw error;
    }
  }

  public async createDraw(personId: string, loanId: string): Promise<Draw> {
    const response = await this.peachClient.post(
      `/people/${personId}/loans/${loanId}/draws`,
      {
        nickname: 'Credit Card',
        status: 'originated',
        atOrigination: {
          minPaymentCalculation: {
            percentageOfPrincipal: 0.1,
            minAmount: 0,
          },
        },
      },
    );

    return response.data.data;
  }

  public async activateDraw(
    personId: string,
    loanId: string,
    drawId: string,
  ): Promise<void> {
    try {
      await this.peachClient.post(
        `/people/${personId}/loans/${loanId}/draws/${drawId}/activate`,
      );
    } catch (error) {
      const axiosError: PeachErrorResponse = error;

      if (axiosError.status !== this.ALREADY_ACTIVATED_STATUS) throw error;
    }
  }

  public async createPurchase(
    personId: string,
    loanId: string,
    drawId: string,
    transaction: TransactionUpdatedPayload,
  ): Promise<void> {
    try {
      await this.peachClient.post(
        `/people/${personId}/loans/${loanId}/draws/${drawId}/purchases`,
        {
          externalId: String(transaction.id),
          type: PeachTransactionType[transaction.type],
          status: PeachTransactionStatus.pending,
          ...this.createPurchaseDetails(transaction),
        },
      );
    } catch (e) {
      const error: PeachErrorResponse = e;
      this.ignoreDuplicatedEntityError(error);
    }
  }

  public async updatePurchase(
    personId: string,
    loanId: string,
    drawId: string,
    transaction: TransactionUpdatedPayload,
  ): Promise<void> {
    await this.peachClient.put(
      `/people/${personId}/loans/${loanId}/draws/${drawId}/purchases/ext-${String(
        transaction.id,
      )}`,
      {
        type: PeachTransactionType[transaction.type],
        status:
          transaction.type === 'dispute'
            ? 'dispute'
            : PeachTransactionStatus[transaction.status],
        ...this.createPurchaseDetails(transaction),
      },
    );
  }

  private createPurchaseDetails(
    transaction: TransactionUpdatedPayload,
  ): object {
    return {
      amount: Number(transaction.us_dollar_amount),
      purchaseDate: transaction.created_at,
      purchaseDetails: {
        description: transaction.description,
        merchantName: transaction.merchant_name ?? undefined,
        externalCardId: transaction.debit_card_uid ?? undefined,
        merchantCity: transaction.merchant_location ?? undefined,
        merchantId: transaction.merchant_number ?? undefined,
        merchantCategoryCode: transaction.mcc ?? undefined,
        metadata: {
          transactionType: transaction.type,
        },
      },
      declineReason: {
        mainText: transaction.denial_reason ?? undefined,
      },
    };
  }

  public async getCreditBalance(
    personId: string,
    loanId: string,
  ): Promise<Credit> {
    const response = await this.peachClient.get(
      `people/${personId}/loans/${loanId}/balances`,
    );
    const responseBody: Balances = response.data.data;

    if (responseBody.isLocked) {
      throw new Error('Balance change is in progress, retry');
    }

    return {
      availableCreditAmount: responseBody.availableCreditAmount,
      creditLimitAmount: responseBody.creditLimitAmount,
      utilizationAmount: responseBody.utilizationAmount,
      calculatedAt: responseBody.calculatedAt,
    };
  }

  public async getLoanObligations(
    personId: string,
    loanId: string,
  ): Promise<Obligations> {
    const response = await this.peachClient.get(
      `people/${personId}/loans/${loanId}/obligations`,
    );

    return response.data.data;
  }

  public async getLoanBalances(
    personId: string,
    loanId: string,
  ): Promise<Balances> {
    const response = await this.peachClient.get(
      `people/${personId}/loans/${loanId}/balances`,
    );

    return response.data.data;
  }

  public async createOneTimeTransaction(
    borrower: Borrower,
    amount: number,
    paymentInstrumentId: string,
    scheduledDate?: string | null,
  ): Promise<void> {
    try {
      await this.peachClient.post(
        `people/${borrower.personId}/loans/${borrower.creditLineId}/transactions`,
        {
          type: 'oneTime',
          drawId: borrower.drawId,
          paymentInstrumentId: paymentInstrumentId,
          amount,
          scheduledDate: scheduledDate ?? undefined,
        },
      );
    } catch (error) {
      if (error.status === 404) {
        throw new PaymentInstrumentNotFoundError();
      }
      if (error.status === 400) {
        throw new AmountExceedsOutstandingBalanceError();
      }

      throw error;
    }
  }

  public async getPaymentInstruments(
    personId: string,
  ): Promise<PaymentInstrument[]> {
    const response = await this.peachClient.get(
      `/people/${personId}/payment-instruments`,
    );

    return response.data.data;
  }

  public async getCachedBalance(
    personId: string,
    paymentInstrumentId: string,
  ): Promise<PaymentInstrumentBalance> {
    let response;

    try {
      response = await this.peachClient.get(
        `/people/${personId}/payment-instruments/${paymentInstrumentId}/balance`,
      );
    } catch (error) {
      if (error.status === 404) {
        response = await this.peachClient.post(
          `/people/${personId}/payment-instruments/${paymentInstrumentId}/balance`,
          {},
        );
      } else {
        throw error;
      }
    }

    return response.data.data;
  }

  public async getRefreshedBalance(
    personId: string,
    paymentInstrumentId: string,
  ): Promise<PaymentInstrumentBalance> {
    const response = await this.peachClient.post(
      `/people/${personId}/payment-instruments/${paymentInstrumentId}/balance`,
      {},
    );

    return response.data.data;
  }

  public async getPayments(
    personId: string,
    loanId: string,
    query: QueryParams,
  ): Promise<Payments> {
    const response = await this.peachClient.get(
      `/people/${personId}/loans/${loanId}/transactions`,
      {
        params: omitBy(query, isNil),
      },
    );

    return response.data;
  }

  public async getPurchases(
    borrower: Borrower,
    query: QueryParams,
  ): Promise<Purchases> {
    const response = await this.peachClient.get(
      `/people/${borrower.personId}/loans/${borrower.creditLineId}/draws/${borrower.drawId}/purchases`,
      {
        params: omitBy(query, isNil),
      },
    );

    return response.data;
  }

  private ignoreDuplicatedEntityError(error: PeachErrorResponse): void {
    if (
      error.status !== 409 &&
      !error.errorResponse.message.startsWith('Duplicate external ID')
    ) {
      throw error;
    }
  }
}
