import { Injectable } from '@nestjs/common';
import { GetKycResponse } from '@archie-microservices/api-interfaces/kyc';
import { GetEmailAddressResponse } from '@archie-microservices/api-interfaces/user';
import { InternalApiService } from '@archie-microservices/internal-api';
import { RizeApiService } from './api/rize_api.service';
import {
  ComplianceDocumentAcknowledgementRequest,
  ComplianceDocuments,
  Customer,
  CustomerDetails,
} from './api/rize_api.interfaces';
import { CustomerAlreadyExists } from './rize.errors';

@Injectable()
export class RizeService {
  constructor(
    private internalApiService: InternalApiService,
    private rizeApiService: RizeApiService,
  ) {}

  public async createUser(userId: string, userIp): Promise<void> {
    // optimization only fetch if create returns error
    const existingCustomer: Customer | null =
      await this.rizeApiService.searchCustomers(userId);
    console.log('ip', userIp);

    if (existingCustomer !== null && existingCustomer.status === 'active') {
      throw new CustomerAlreadyExists();
    }

    // const kyc: GetKycResponse = await this.internalApiService.getKyc(userId); // format ssn as ###-##-### TODO!!
    // const emailAddressResponse: GetEmailAddressResponse =
    //   await this.internalApiService.getUserEmailAddress(userId);

    const kyc: GetKycResponse = {
      firstName: 'Andraz1',
      lastName: 'Cudermands',
      dateOfBirth: '1997-03-25',
      addressCountry: 'US',
      addressLocality: 'Los Angeles',
      addressPostalCode: '90012',
      addressRegion: 'CA',
      addressStreet: 'South Los Angeles Street',
      addressStreetNumber: '120',
      phoneNumber: '5754200097',
      phoneNumberCountryCode: '+1',
      ssn: '232-43-3007',
    };
    const emailAddressResponse: GetEmailAddressResponse = {
      email: 'test24@test.com',
    };
    console.log('here1');
    const customerId: string =
      existingCustomer !== null
        ? existingCustomer.uid
        : await this.rizeApiService.createCustomer(
            userId,
            emailAddressResponse.email,
          );
    console.log('here2');

    await this.rizeApiService.addCustomerPii(
      customerId,
      emailAddressResponse.email,
      this.createCustomerDetails(kyc),
    );

    const complianceDocuments: ComplianceDocuments =
      await this.rizeApiService.createCheckingComplianceDocuments(customerId);

    const docs: ComplianceDocumentAcknowledgementRequest[] =
      complianceDocuments.document_ids.map((documentId) =>
        this.createAcceptedComplianceDocument(documentId, userIp, userId),
      );
    console.log(customerId);

    // TODO: accept in 2 steps
    await this.rizeApiService.acceptComplianceDocuments(
      customerId,
      complianceDocuments.compliance_workflow_uid,
      docs,
    );

    await this.rizeApiService.createCustomerProduct(
      customerId,
      complianceDocuments.product_uid,
    );
    console.log('here7');
  }

  private createAcceptedComplianceDocument(
    documentId: string,
    userIp: string,
    userId: string,
  ): ComplianceDocumentAcknowledgementRequest {
    return {
      accept: 'yes',
      document_uid: documentId,
      user_name: userId,
      ip_address: '123.56.3.12',
    };
  }

  private createCustomerDetails(kyc: GetKycResponse): CustomerDetails {
    return {
      address: {
        city: kyc.addressLocality,
        street1: `${kyc.addressStreetNumber} ${kyc.addressStreet}`,
        state: kyc.addressRegion,
        postal_code: kyc.addressPostalCode,
      },
      business_name: null,
      dob: kyc.dateOfBirth,
      first_name: kyc.firstName,
      last_name: kyc.lastName,
      phone: kyc.phoneNumber,
      ssn: kyc.ssn,
    };
  }
}
