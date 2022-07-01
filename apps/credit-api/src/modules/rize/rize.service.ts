import { Injectable } from '@nestjs/common';
import { GetKycResponse } from '@archie-microservices/api-interfaces/kyc';
import { GetEmailAddressResponse } from '@archie-microservices/api-interfaces/user';
import { InternalApiService } from '@archie-microservices/internal-api';
import { RizeApiService } from './api/rize_api.service';
import {
  ComplianceDocumentAcknowledgementRequest,
  ComplianceWorkflow,
  ComplianceWorkflowMeta,
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

  public async createUser(
    userId: string,
    userIp: string | undefined,
  ): Promise<void> {
    const existingCustomer: Customer | null =
      await this.rizeApiService.searchCustomers(userId);

    if (existingCustomer !== null && existingCustomer.status === 'active') {
      throw new CustomerAlreadyExists();
    }

    const kyc: GetKycResponse = await this.internalApiService.getKyc(userId);
    const emailAddressResponse: GetEmailAddressResponse =
      await this.internalApiService.getUserEmailAddress(userId);

    const customerId: string =
      existingCustomer !== null
        ? existingCustomer.uid
        : await this.rizeApiService.createCustomer(
            userId,
            emailAddressResponse.email,
          );

    await this.rizeApiService.addCustomerPii(
      customerId,
      emailAddressResponse.email,
      this.createCustomerDetails(kyc),
    );

    let complianceWorkflow: ComplianceWorkflowMeta;
    try {
      complianceWorkflow =
        await this.rizeApiService.createCheckingComplianceWorkflow(customerId);
    } catch {
      complianceWorkflow = await this.rizeApiService.getLastComplianceWorkflow(
        customerId,
      );
    }

    await this.acceptAllDocuments(
      customerId,
      userId,
      userIp,
      complianceWorkflow,
    );

    await this.rizeApiService.createCustomerProduct(
      customerId,
      complianceWorkflow.product_uid,
    );
  }

  private async acceptAllDocuments(
    customerId: string,
    userId: string,
    userIp: string,
    complianceWorkflow: ComplianceWorkflowMeta,
  ) {
    for (
      let step = complianceWorkflow.current_step;
      step <= complianceWorkflow.last_step;
      step++
    ) {
      const complianceWorkflowDocuments =
        step === complianceWorkflow.current_step
          ? complianceWorkflow
          : await this.rizeApiService.getLastComplianceWorkflow(customerId);

      if (complianceWorkflowDocuments.pending_documents.length === 0) {
        break;
      }
      const docs: ComplianceDocumentAcknowledgementRequest[] =
        complianceWorkflowDocuments.pending_documents.map((documentId) =>
          this.createAcceptedComplianceDocument(documentId, userIp, userId),
        );

      await this.rizeApiService.acceptComplianceDocuments(
        customerId,
        complianceWorkflowDocuments.compliance_workflow_uid,
        docs,
      );
    }
  }

  private createAcceptedComplianceDocument(
    documentId: string,
    userIp: string | undefined,
    userId: string,
  ): ComplianceDocumentAcknowledgementRequest {
    return {
      accept: 'yes',
      document_uid: documentId,
      user_name: userId,
      ip_address: userIp ?? '123.56.3.12', //TODO: remove optional
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
      ssn: `${kyc.ssn.slice(0, 3)}-${kyc.ssn.slice(3, 5)}-${kyc.ssn.slice(5)}`,
    };
  }
}
