import { Injectable } from '@nestjs/common';
import {
  ComplianceDocumentAcknowledgementRequest,
  CustomerDetails,
} from '../api/rize_api.interfaces';
import { GetKycResponse } from '@archie/api/utils/interfaces/kyc';

@Injectable()
export class RizeFactoryService {
  public createAcceptedComplianceDocument(
    documentId: string,
    userIp: string,
    userId: string,
  ): ComplianceDocumentAcknowledgementRequest {
    return {
      accept: 'yes',
      document_uid: documentId,
      user_name: userId,
      ip_address: userIp,
    };
  }

  public createCustomerDetails(kyc: GetKycResponse): CustomerDetails {
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
      ssn: `${kyc.ssn.slice(0, 3)}-${kyc.ssn.slice(3, 5)}-${kyc.ssn.slice(5)}`,
    };
  }
}
