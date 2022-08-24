import { Controller } from '@nestjs/common';
import { Subscribe } from '@archie/api/utils/queue';
import {
  EMAIL_VERIFIED_TOPIC,
  KYC_SUBMITTED_TOPIC,
} from '@archie/api/user-api/constants';
import { SERVICE_QUEUE_NAME } from '@archie/api/mail-api/constants';

import { EmailVerifiedDto, KycSubmittedDto } from './contact.dto';
import { ContactService } from './contact.service';

@Controller()
export class ContactQueueController {
  private static CONTROLLER_QUEUE_NAME = `${SERVICE_QUEUE_NAME}-contact`;

  constructor(private contactService: ContactService) {}

  @Subscribe(KYC_SUBMITTED_TOPIC, ContactQueueController.CONTROLLER_QUEUE_NAME)
  async kycSubmittedHandler(payload: KycSubmittedDto): Promise<void> {
    await this.contactService.saveFirstName(payload.userId, payload.firstName);
  }

  @Subscribe(EMAIL_VERIFIED_TOPIC, ContactQueueController.CONTROLLER_QUEUE_NAME)
  async emailVerifiedHandler(payload: EmailVerifiedDto): Promise<void> {
    await this.contactService.saveEmail(payload.userId, payload.email);
  }
}
