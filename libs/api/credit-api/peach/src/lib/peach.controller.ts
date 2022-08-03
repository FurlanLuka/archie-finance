import { Controller } from '@nestjs/common';
import { Subscribe } from '@archie/api/utils/queue';
import {
  CARD_ACTIVATED_TOPIC,
  SERVICE_QUEUE_NAME,
} from '@archie/api/credit-api/constants';
import { PeachService } from './peach.service';
import {
  EMAIL_VERIFIED_TOPIC,
  KYC_SUBMITTED_TOPIC,
} from '@archie/api/user-api/constants';

@Controller()
export class PeachQueueController {
  constructor(private peachService: PeachService) {}

  @Subscribe(KYC_SUBMITTED_TOPIC, SERVICE_QUEUE_NAME)
  async kycSubmittedHandler(payload: any): Promise<void> {
    await this.peachService.initPerson();
  }

  @Subscribe(EMAIL_VERIFIED_TOPIC, SERVICE_QUEUE_NAME)
  async emailVerifiedHandler(payload: any): Promise<void> {
    await this.peachService.addEmailContact();
  }

  @Subscribe(CARD_ACTIVATED_TOPIC, SERVICE_QUEUE_NAME)
  async cardActivatedHandler(payload: any): Promise<void> {
    await this.peachService.initBorrower();
  }
}
