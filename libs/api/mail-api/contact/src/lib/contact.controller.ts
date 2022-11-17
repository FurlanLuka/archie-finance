import { Controller } from '@nestjs/common';
import { Subscribe } from '@archie/api/utils/queue/decorators/subscribe';
import {
  EMAIL_VERIFIED_TOPIC,
  KYC_SUBMITTED_TOPIC,
} from '@archie/api/user-api/constants';
import { SERVICE_QUEUE_NAME } from '@archie/api/mail-api/constants';

import { ContactService } from './contact.service';
import { EmailVerifiedPayload } from '@archie/api/user-api/data-transfer-objects';
import { KycSubmittedPayload } from '@archie/api/user-api/data-transfer-objects/types';

@Controller()
export class ContactQueueController {
  private static CONTROLLER_QUEUE_NAME = `${SERVICE_QUEUE_NAME}-contact`;

  constructor(private contactService: ContactService) {}

  @Subscribe(KYC_SUBMITTED_TOPIC, ContactQueueController.CONTROLLER_QUEUE_NAME)
  async kycSubmittedHandler(payload: KycSubmittedPayload): Promise<void> {
    await this.contactService.saveFirstName(payload.userId, payload.firstName);
  }

  @Subscribe(EMAIL_VERIFIED_TOPIC, ContactQueueController.CONTROLLER_QUEUE_NAME)
  async emailVerifiedHandler(payload: EmailVerifiedPayload): Promise<void> {
    await this.contactService.saveEmail(payload.userId, payload.email);
  }
}
