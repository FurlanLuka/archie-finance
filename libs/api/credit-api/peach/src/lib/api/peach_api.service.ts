import { Injectable } from '@nestjs/common';
import axios, { AxiosError, AxiosInstance } from 'axios';
import { ConfigService } from '@archie/api/utils/config';
import { ConfigVariables } from '@archie/api/credit-api/constants';
import {
  CreditLimit,
  CreditLine,
  HomeAddress,
  IdentityType,
  PeachErrorData,
  PeachErrorResponse,
  Person,
  PersonStatus,
} from './peach_api.interfaces';
import { KycSubmittedPayload } from '@archie/api/user-api/kyc';

@Injectable()
export class PeachApiService {
  MAX_REQUEST_TIMEOUT = 10000;
  CONTACT_ALREADY_EXISTS_STATUS = 400;
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

  public async createPerson(kyc: KycSubmittedPayload): Promise<Person> {
    const response = await this.peachClient.post('/people', {
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

  public async createUser(personId, email: string): Promise<void> {
    await this.peachClient.post(
      `/companies/${this.configService.get(
        ConfigVariables.PEACH_COMPANY_ID,
      )}/users`,
      {
        userType: 'borrower',
        authType: {
          email,
        },
        roles: [this.configService.get(ConfigVariables.PEACH_BORROWER_ROLE_ID)],
        associatedPersonId: personId,
      },
    );
  }

  public async createCreditLine(
    personId,
    creditLimit: number,
    addressContactId: string,
  ): Promise<CreditLine> {
    const response = await this.peachClient.post(`/people/${personId}/loans`, {
      loanTypeId: this.configService.get(ConfigVariables.PEACH_LOAN_ID),
      type: 'lineOfCredit',
      // TODO: check if ok
      servicedBy: 'creditor',
      status: 'originated',
      newDrawsAllowed: true,
      atOrigination: {
        // TODO: check if ok
        interestRates: [{ days: null, rate: 0.0 }],
        paymentFrequency: 'monthly',
        // TODO: check if ok
        originationLicense: 'nationalBank',
        // TODO: check if ok
        originatingCreditorName: 'Bank of Mars',
        creditLimitAmount: creditLimit,
        // TODO: should we define down payment? - Collateral value
        // downPaymentAmount: 0,
        personAddressId: addressContactId,
        // TODO: merchantId should we define?
      },
    });

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

  public async activateCreditLine(personId, loanId: string): Promise<void> {
    await this.peachClient.post(
      `/people/${personId}/loans/${loanId}/activate`,
      {},
    );
  }
}
