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
import { KycSubmittedPayload } from '@archie/api/user-api/kyc';
import { EmailVerifiedPayload } from '@archie/api/user-api/user';
import { CardActivatedPayload } from '../../../rize/src/lib/rize.dto';

@Controller()
export class PeachQueueController {
  constructor(private peachService: PeachService) {}

  @Subscribe(KYC_SUBMITTED_TOPIC, SERVICE_QUEUE_NAME)
  async kycSubmittedHandler(payload: KycSubmittedPayload): Promise<void> {
    await this.peachService.handleKycSubmittedEvent(payload);
  }

  @Subscribe(EMAIL_VERIFIED_TOPIC, SERVICE_QUEUE_NAME)
  async emailVerifiedHandler(payload: EmailVerifiedPayload): Promise<void> {
    await this.peachService.handleEmailVerifiedEvent(payload);
  }

  @Subscribe(CARD_ACTIVATED_TOPIC, SERVICE_QUEUE_NAME + '-peach')
  async cardActivatedHandler(payload: CardActivatedPayload): Promise<void> {
    await this.peachService.handleCardActivatedEvent(payload);
  }
}
