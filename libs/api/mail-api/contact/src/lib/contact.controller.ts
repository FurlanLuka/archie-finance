import { Controller } from '@nestjs/common';
import { Subscribe } from '@archie/api/utils/queue';
import {
  EMAIL_VERIFIED_EXCHANGE,
  KYC_SUBMITTED_EXCHANGE,
} from '@archie/api/user-api/constants';
import { SERVICE_QUEUE_NAME } from '@archie/api/mail-api/constants';

import { EmailVerifiedDto, KycSubmittedDto } from './contact.dto';
import { ContactService } from './contact.service';

@Controller()
export class ContactController {
  constructor(private contactService: ContactService) {}

  @Subscribe(KYC_SUBMITTED_EXCHANGE, SERVICE_QUEUE_NAME)
  async kycSubmittedHandler(payload: KycSubmittedDto): Promise<void> {
    await this.contactService.saveFirstName(payload.userId, payload.firstName);
  }

  @Subscribe(EMAIL_VERIFIED_EXCHANGE, SERVICE_QUEUE_NAME)
  async emailVerifiedHandler(payload: EmailVerifiedDto): Promise<void> {
    await this.contactService.saveEmail(payload.userId, payload.email);
  }
}
