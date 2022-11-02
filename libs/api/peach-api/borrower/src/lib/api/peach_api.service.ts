import { Injectable, Logger } from '@nestjs/common';
import axios, { AxiosError, AxiosInstance } from 'axios';
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
  Document,
  AutopayOptions,
  Autopay,
  Payments,
  QueryParams,
  Purchases,
  Balances,
  PeachResponseData,
  AutopayContext,
  Statement,
  DocumentUrl,
  PeachOneTimePaymentStatus,
  Payment,
} from './peach_api.interfaces';
import { Borrower } from '../borrower.entity';
import {
  PaymentInstrumentNotFoundError,
  AmountExceedsOutstandingBalanceError,
  PaymentInstrumentNotFound,
  AutopayNotConfiguredError,
  AutopayAlreadyConfiguredError,
  CreditBalanceChangeInProgress,
} from '../borrower.errors';
import { DateTime } from 'luxon';
import { omitBy, isNil } from 'lodash';
import { KycSubmittedPayload } from '@archie/api/user-api/data-transfer-objects/types';
import { TransactionUpdatedPayload } from '@archie/api/credit-api/data-transfer-objects';
import { BorrowerWithCreditLine } from '../utils/borrower.validation.interfaces';

@Injectable()
export class PeachApiService {
  MAX_REQUEST_TIMEOUT = 10000;
  CONFLICT_ERROR_MESSAGE = 'collision detected';
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
        status: error.response?.status ?? 500,
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
    const response = await this.peachClient.post<
      PeachResponseData<PaymentInstrument[]>
    >(`/people/${personId}/payment-instruments`, {
      status: 'active',
      instrumentType: 'paymentNetwork',
      paymentNetworkName: 'Fireblocks internal transaction',
    });

    return response.data.data[0];
  }

  public async createPlaidPaymentInstrument(
    personId: string,
    accountId: string,
    publicToken: string,
    fullName: string,
  ): Promise<PaymentInstrument> {
    const response = await this.peachClient.post<
      PeachResponseData<PaymentInstrument[]>
    >(`/people/${personId}/payment-instruments`, {
      instrumentType: 'plaid',
      accessToken: publicToken,
      accountIds: [accountId],
      accountHolderType: 'personal',
      accountHolderName: fullName,
    });

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

  public async getPaymentInstruments(
    personId: string,
  ): Promise<PaymentInstrument[]> {
    const response = await this.peachClient.get<
      PeachResponseData<PaymentInstrument[]>
    >(`/people/${personId}/payment-instruments`);

    return response.data.data;
  }
  public async getPaymentInstrument(
    personId: string,
    paymentInstrumentId: string,
  ): Promise<PaymentInstrument> {
    try {
      const response = await this.peachClient.get<
        PeachResponseData<PaymentInstrument>
      >(`/people/${personId}/payment-instruments/${paymentInstrumentId}`);

      return response.data.data;
    } catch (e) {
      const error: PeachErrorResponse = e;

      if (error.status === 404) {
        throw new PaymentInstrumentNotFound();
      }

      throw error;
    }
  }

  public async tryCreatingOneTimePaymentTransaction(
    borrower: BorrowerWithCreditLine,
    paymentInstrumentId: string,
    amount: number,
    externalId: string,
    status: PeachOneTimePaymentStatus,
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

      if (error.status === 400) {
        try {
          await this.getPayment(
            borrower.personId,
            borrower.creditLineId,
            externalId,
          );
        } catch {
          throw error;
        }
      } else {
        this.ignoreDuplicatedEntityError(error);
      }
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
    const response = await this.peachClient.post<PeachResponseData<Person>>(
      '/people',
      {
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
      },
    );

    return response.data.data;
  }

  public async addHomeAddressContact(
    personId: string,
    kyc: KycSubmittedPayload,
  ): Promise<HomeAddress> {
    const response = await this.peachClient.post<
      PeachResponseData<HomeAddress>
    >(`/people/${personId}/contacts`, {
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
    });

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

      if (axiosError.errorResponse.message !== this.CONFLICT_ERROR_MESSAGE)
        throw error;
    }
  }

  public async addMailContact(personId: string, email: string): Promise<void> {
    try {
      await this.peachClient.post(`/people/${personId}/contacts`, {
        contactType: 'email',
        label: 'personal',
        affiliation: 'self',
        status: 'primary',
        value: email,
        valid: true,
        verified: true,
      });
    } catch (error) {
      const axiosError: PeachErrorResponse = error;

      if (axiosError.errorResponse.message !== this.CONFLICT_ERROR_MESSAGE)
        throw error;
    }
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
    const response = await this.peachClient.post<PeachResponseData<CreditLine>>(
      `/people/${personId}/loans`,
      {
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
      },
    );

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

  public async updateCreditLimit(
    personId: string,
    loanId: string,
    newAmount: number,
  ): Promise<CreditLimit> {
    const response = await this.peachClient.post<
      PeachResponseData<CreditLimit>
    >(`/people/${personId}/loans/${loanId}/credit-limit`, {
      creditLimitAmount: newAmount,
    });

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
    const response = await this.peachClient.post<PeachResponseData<Draw>>(
      `/people/${personId}/loans/${loanId}/draws`,
      {
        nickname: 'Credit Card',
        status: 'originated',
        atOrigination: {},
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
        {
          params: {
            force: true,
            sync: true,
          },
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
    const response = await this.peachClient.get<PeachResponseData<Balances>>(
      `people/${personId}/loans/${loanId}/balances`,
    );
    const responseBody: Balances = response.data.data;

    if (responseBody.isLocked) {
      Logger.error('Credit balance change is in progress, retry');

      throw new CreditBalanceChangeInProgress();
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
    const response = await this.peachClient.get<PeachResponseData<Obligations>>(
      `people/${personId}/loans/${loanId}/obligations`,
    );

    return response.data.data;
  }

  public async getLoanBalances(
    personId: string,
    loanId: string,
  ): Promise<Balances> {
    const response = await this.peachClient.get<PeachResponseData<Balances>>(
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
    } catch (e) {
      const error: PeachErrorResponse = e;

      if (error.status === 404) {
        throw new PaymentInstrumentNotFoundError();
      }
      if (error.status === 400) {
        throw new AmountExceedsOutstandingBalanceError();
      }

      throw error;
    }
  }

  public async createAutopayAgreementDocument(
    personId: string,
    loanId: string,
  ): Promise<Document> {
    const response = await this.peachClient.post<Document>(
      `/people/${personId}/documents`,
      {
        type: 'loanAutopayAgreement',
        loanId,
        status: 'draft',
        fileName: `LoanAutopayAgreement-${loanId}.html`,
      },
    );

    return response.data;
  }

  public async getPayments(
    personId: string,
    loanId: string,
    query: QueryParams,
  ): Promise<Payments> {
    const response = await this.peachClient.get<Payments>(
      `/people/${personId}/loans/${loanId}/transactions`,
      {
        params: omitBy(query, isNil),
      },
    );

    return response.data;
  }

  public async getPayment(
    personId: string,
    loanId: string,
    externalTransactionId: string,
  ): Promise<Payment> {
    const response = await this.peachClient.get<Payment>(
      `/people/${personId}/loans/${loanId}/transactions/ext-${externalTransactionId}`,
    );

    return response.data;
  }

  public async getPurchases(
    borrower: Borrower,
    query: QueryParams,
  ): Promise<Purchases> {
    const response = await this.peachClient.get<Purchases>(
      `/people/${borrower.personId}/loans/${borrower.creditLineId}/draws/${borrower.drawId}/purchases`,
      {
        params: omitBy(query, isNil),
      },
    );

    return response.data;
  }

  public async acceptAutopayAgreementDocument(
    personId: string,
    documentId: string,
  ): Promise<Document> {
    const response = await this.peachClient.put<Document>(
      `/people/${personId}/documents/${documentId}`,
      {
        status: 'accepted',
      },
    );

    return response.data;
  }

  public async archiveAutopayAgreementDocument(
    personId: string,
    documentId: string,
  ): Promise<Document> {
    const response = await this.peachClient.put<Document>(
      `/people/${personId}/documents/${documentId}`,
      {
        archived: true,
      },
    );

    return response.data;
  }

  public async getAutopayAgreementHtml(
    personId: string,
    loanId: string,
    paymentMethodLastFour: string,
  ): Promise<string> {
    const response = await this.peachClient.post<string>(
      `/communicator/render`,
      {
        subject: 'autopayAgreement',
        channel: 'gui',
        personId,
        loanId,
        context: this.createDocumentContext(paymentMethodLastFour),
      },
    );

    return response.data;
  }

  public async convertAutopayAgreementToDocument(
    personId: string,
    loanId: string,
    paymentMethodLastFour: string,
    documentAgreementId: string,
  ): Promise<void> {
    await this.peachClient.post(`/communicator/render-to-document`, {
      subject: 'autopayAgreement',
      channel: 'document',
      format: 'pdf',
      personId,
      documentId: documentAgreementId,
      loanId,
      context: this.createDocumentContext(paymentMethodLastFour),
    });
  }

  private createDocumentContext(paymentMethodLastFour: string): AutopayContext {
    return {
      lenderName: 'Archie (Lender name - Change)',
      paymentMethod: 'bankAccount',
      paymentMethodLastFour,
      supportPhone: '888-888-8888 - Change',
      supportEmail: 'support@peach.finance - Change',
      dateSigned: DateTime.now().toLocaleString(DateTime.DATE_MED),
    };
  }

  public async createAutopay(
    personId: string,
    loanId: string,
    config: AutopayOptions,
    pdfDocumentId: string,
  ): Promise<void> {
    try {
      await this.peachClient.post(
        `/people/${personId}/loans/${loanId}/autopay`,
        {
          amountType: config.amountType,
          extraAmount: config.extraAmount ?? undefined,
          isAlignedToDueDates: config.isAlignedToDueDates,
          offsetFromDueDate: config.offsetFromDueDate ?? undefined,
          paymentInstrumentId: config.paymentInstrumentId,
          agreementDocumentId: pdfDocumentId,
        },
      );
    } catch (e) {
      const error: PeachErrorResponse = e;

      if (error.status === 400) {
        throw new AutopayAlreadyConfiguredError();
      }

      throw error;
    }
  }

  public async convertDocumentToPdf(
    personId: string,
    documentId: string,
  ): Promise<Document> {
    const response = await this.peachClient.post<Document>(
      `/people/${personId}/documents/${documentId}/convert`,
      {},
      {
        params: {
          format: 'pdf',
        },
      },
    );

    return response.data;
  }

  public async getStatements(
    personId: string,
    loanId: string,
  ): Promise<Statement[]> {
    // TODO pagination?
    const response = await this.peachClient.get<PeachResponseData<Statement[]>>(
      `/people/${personId}/loans/${loanId}/statements`,
      { params: { limit: 100 } },
    );

    return response.data.data;
  }

  public async getDocumentUrl(
    personId: string,
    documentId: string,
  ): Promise<DocumentUrl> {
    const response = await this.peachClient.get<DocumentUrl>(
      `/people/${personId}/documents/${documentId}/content`,
      { params: { returnUrl: true } },
    );

    return response.data;
  }

  public async cancelAutopay(personId: string, loanId: string): Promise<void> {
    await this.peachClient.delete(
      `/people/${personId}/loans/${loanId}/autopay`,
    );
  }

  public async getAutopay(personId: string, loanId: string): Promise<Autopay> {
    try {
      const response = await this.peachClient.get<PeachResponseData<Autopay>>(
        `/people/${personId}/loans/${loanId}/autopay`,
      );

      return response.data.data;
    } catch (e) {
      const error: PeachErrorResponse = e;

      if (error.status === 404) {
        throw new AutopayNotConfiguredError();
      }

      throw error;
    }
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
