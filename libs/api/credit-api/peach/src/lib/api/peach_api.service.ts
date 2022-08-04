import { Injectable } from '@nestjs/common';
import axios, { AxiosError, AxiosInstance } from 'axios';
import { ConfigService } from '@archie/api/utils/config';
import { ConfigVariables } from '@archie/api/credit-api/constants';
import { IdentityType, Person, PersonStatus } from './peach_api.interfaces';
import { KycSubmittedPayload } from '@archie/api/user-api/kyc';

@Injectable()
export class PeachApiService {
  MAX_REQUEST_TIMEOUT = 10000;
  CONTACT_ALREADY_EXISTS_STATUS = 400;
  PERSON_ALREADY_EXISTS_STATUS = 409;
  peachClient: AxiosInstance;

  constructor(private configService: ConfigService) {
    this.peachClient = this.createApiClient();
  }

  private createApiClient(): AxiosInstance {
    return axios.create({
      baseURL: this.configService.get(ConfigVariables.PEACH_BASE_URL),
      timeout: this.MAX_REQUEST_TIMEOUT,
      headers: {
        'X-API-KEY': this.configService.get(ConfigVariables.PEACH_API_KEY),
      },
    });
  }

  public async tryCreatingPerson(kyc: KycSubmittedPayload): Promise<Person> {
    try {
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
    } catch (error) {
      const axiosError: AxiosError = error;

      if (axiosError.response.status === this.PERSON_ALREADY_EXISTS_STATUS) {
        const existingPerson = await this.peachClient.get(
          `/people/${kyc.userId}`,
        );

        return existingPerson.data.data;
      }

      throw error;
    }
  }

  public async addHomeAddressContact(
    personId: string,
    kyc: KycSubmittedPayload,
  ): Promise<void> {
    await this.peachClient.post(`/people/${personId}/contacts`, {
      contactType: 'address',
      label: 'home',
      affiliation: 'self',
      status: 'primary',
      address: {
        addressLine1: `${kyc.addressStreetNumber} ${kyc.addressStreet}`,
        city: kyc.addressLocality,
        countryOrRegion: kyc.addressCountry,
        state: kyc.addressRegion, // TODO: state !== region
        postalCode: kyc.addressPostalCode,
        country: kyc.addressCountry,
      },
    });
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
      const axiosError: AxiosError = error;

      if (axiosError.response.status !== this.CONTACT_ALREADY_EXISTS_STATUS)
        throw error;
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
        roles: ['{{borrower_role_id}}'],
        associatedPersonId: personId,
      },
    );
  }
}
