import { Controller } from '@nestjs/common';
import { Subscribe } from '@archie/api/utils/queue';
import {
  CARD_ACTIVATED_TOPIC,
  CREDIT_FUNDS_LOADED_TOPIC,
  CREDIT_LIMIT_DECREASED_TOPIC,
  CREDIT_LIMIT_INCREASED_TOPIC,
  SERVICE_QUEUE_NAME,
  TRANSACTION_UPDATED_TOPIC,
} from '@archie/api/credit-api/constants';
import { PeachBorrowerService } from './loan.service';
import {
  EMAIL_VERIFIED_TOPIC,
  KYC_SUBMITTED_TOPIC,
} from '@archie/api/user-api/constants';
import { KycSubmittedPayload } from '@archie/api/user-api/kyc';
import { EmailVerifiedPayload } from '@archie/api/user-api/user';
import {
  CreditLimitDecreasedPayload,
  CreditLimitIncreasedPayload,
} from '@archie/api/credit-api/data-transfer-objects';

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
    CARD_ACTIVATED_TOPIC,
    PeachBorrowerQueueController.CONTROLLER_QUEUE_NAME,
  )
  async cardActivatedHandler(payload): Promise<void> {
    await this.peachService.handleCardActivatedEvent(payload);
  }

  @Subscribe(
    CREDIT_FUNDS_LOADED_TOPIC,
    PeachBorrowerQueueController.CONTROLLER_QUEUE_NAME,
  )
  async creditFundsLoadedHandler(payload): Promise<void> {
    await this.peachService.handleFundsLoadedEvent(payload);
  }

  @Subscribe(
    CREDIT_LIMIT_INCREASED_TOPIC,
    PeachBorrowerQueueController.CONTROLLER_QUEUE_NAME,
  )
  async creditLimitIncreasedHandler(
    payload: CreditLimitIncreasedPayload,
  ): Promise<void> {
    await this.peachService.handleCreditLimitIncreased(payload);
  }

  @Subscribe(
    CREDIT_LIMIT_DECREASED_TOPIC,
    PeachBorrowerQueueController.CONTROLLER_QUEUE_NAME,
  )
  async creditLimitDecreasedHandler(
    payload: CreditLimitDecreasedPayload,
  ): Promise<void> {
    await this.peachService.handleCreditLimitDecreased(payload);
  }

  @Subscribe(
    TRANSACTION_UPDATED_TOPIC,
    PeachBorrowerQueueController.CONTROLLER_QUEUE_NAME,
  )
  async transactionUpdatedHandler(payload): Promise<void> {
    await this.peachService.handleTransactionsEvent(payload);
  }
}
