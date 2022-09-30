import { Controller } from '@nestjs/common';
import { Subscribe } from '@archie/api/utils/queue';
import { SERVICE_QUEUE_NAME } from '@archie/api/peach-api/constants';
import {
  CREDIT_LIMIT_UPDATED_TOPIC,
  CREDIT_LINE_CREATED_TOPIC,
} from '@archie/api/credit-limit-api/constants';
import { PeachBorrowerService } from './loan.service';
import {
  EMAIL_VERIFIED_TOPIC,
  KYC_SUBMITTED_TOPIC,
} from '@archie/api/user-api/constants';
import {
  CreditLimitUpdatedPayload,
  CreditLineCreatedPayload,
} from '@archie/api/credit-limit-api/data-transfer-objects';
import {
  EmailVerifiedPayload,
  KycSubmittedPayload,
} from '@archie/api/user-api/data-transfer-objects';

@Controller()
export class PeachBorrowerQueueController {
  private static CONTROLLER_QUEUE_NAME = `${SERVICE_QUEUE_NAME}-borrower-loan`;

  constructor(private peachService: PeachBorrowerService) {}

  @Subscribe(
    KYC_SUBMITTED_TOPIC,
    PeachBorrowerQueueController.CONTROLLER_QUEUE_NAME,
  )
  async kycSubmittedHandler(payload: KycSubmittedPayload): Promise<void> {
    await this.peachService.handleKycSubmittedEvent(payload);
  }

  @Subscribe(
    EMAIL_VERIFIED_TOPIC,
    PeachBorrowerQueueController.CONTROLLER_QUEUE_NAME,
  )
  async emailVerifiedHandler(payload: EmailVerifiedPayload): Promise<void> {
    await this.peachService.handleEmailVerifiedEvent(payload);
  }

  @Subscribe(
    CREDIT_LINE_CREATED_TOPIC,
    PeachBorrowerQueueController.CONTROLLER_QUEUE_NAME,
  )
  async creditLineCreatedHandler(
    payload: CreditLineCreatedPayload,
  ): Promise<void> {
    await this.peachService.handleCreditLineCreatedEvent(payload);
  }

  @Subscribe(
    CREDIT_LIMIT_UPDATED_TOPIC,
    PeachBorrowerQueueController.CONTROLLER_QUEUE_NAME,
  )
  async creditLimitUpdatedHandler(
    payload: CreditLimitUpdatedPayload,
  ): Promise<void> {
    await this.peachService.handleCreditLimitUpdatedEvent(payload);
  }
}
