import { Injectable } from '@nestjs/common';

@Injectable()
export class PeachService {
  // kyc topic
  public initPerson() {
    // POST /api/people
    // POST create home address contact
    // POST Create Contact (Mobile Phone) verified - false, receive text messages - false
    // Store person id to user id mapping
  }

  // email verified topic
  public addEmailContact() {
    // POST /api/people/{PERSON_ID_FROM_PREVIOUS_CALL}/contacts
  }

  // card activated topic
  public initBorrower() {
    // POST /api/companies/{companyId}/users
    // POST Create Line of Credit - zero interest
    // POST /api/people/{PERSON_ID}/loans/{LOAN_ID}/activate
    // create draw - x interest
  }

  // on rize payment event
  public addPurchase() {
    // if first purchase - activate draw
    // create purchase
  }
}
