import { Controller } from '@nestjs/common';
import { Subscribe } from '@archie/api/utils/queue';
import {
  CARD_ACTIVATED_TOPIC,
  CREDIT_FUNDS_LOADED_TOPIC,
  CREDIT_LIMIT_DECREASED_TOPIC,
  CREDIT_LIMIT_INCREASED_TOPIC,
  SERVICE_QUEUE_NAME,
} from '@archie/api/credit-api/constants';
import { PeachService } from './peach.service';
import {
  EMAIL_VERIFIED_TOPIC,
  KYC_SUBMITTED_TOPIC,
} from '@archie/api/user-api/constants';
import { KycSubmittedPayload } from '@archie/api/user-api/kyc';
import { EmailVerifiedPayload } from '@archie/api/user-api/user';
import {
  CardActivatedPayload,
  FundsLoadedPayload,
} from '../../../rize/src/lib/rize.dto';
import {
  CreditLimitDecreasedPayload,
  CreditLimitIncreasedPayload,
} from '@archie/api/credit-api/margin';

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

  @Subscribe(CREDIT_FUNDS_LOADED_TOPIC, SERVICE_QUEUE_NAME)
  async creditFundsLoadedHandler(payload: FundsLoadedPayload): Promise<void> {
    await this.peachService.handleFundsLoadedEvent(payload);
  }

  @Subscribe(CREDIT_LIMIT_INCREASED_TOPIC, SERVICE_QUEUE_NAME + '-peach')
  async creditLimitIncreasedHandler(
    payload: CreditLimitIncreasedPayload,
  ): Promise<void> {
    await this.peachService.handleCreditLimitIncreased(payload);
  }

  @Subscribe(CREDIT_LIMIT_DECREASED_TOPIC, SERVICE_QUEUE_NAME + '-peach')
  async creditLimitDecreasedHandler(
    payload: CreditLimitDecreasedPayload,
  ): Promise<void> {
    await this.peachService.handleCreditLimitDecreased(payload);
  }

  // TODO: handle purchase events
  // TODO: handle down payments?? crypto
}
