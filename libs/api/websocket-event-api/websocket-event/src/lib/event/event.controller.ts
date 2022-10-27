import { Controller } from '@nestjs/common';
import {
  SERVICE_INSTANCE_ID,
  SERVICE_NAME,
} from '@archie/api/websocket-event-api/constants';
import { Subscribe } from '@archie/api/utils/queue/decorators/subscribe';
import { LEDGER_ACCOUNT_UPDATED_TOPIC } from '@archie/api/ledger-api/constants';
import { LedgerAccountUpdatedPayload } from '@archie/api/ledger-api/data-transfer-objects/types';
import { EventService } from './event.service';
import { CREDIT_BALANCE_UPDATED_TOPIC } from '@archie/api/peach-api/constants';
import { CreditBalanceUpdatedPayload } from '@archie/api/peach-api/data-transfer-objects';
import { LTV_UPDATED_TOPIC } from '@archie/api/ltv-api/constants';
import { LtvUpdatedPayload } from '@archie/api/ltv-api/data-transfer-objects/types';
import { ONBOARDING_UPDATED_TOPIC } from '@archie/api/onboarding-api/constants';
import { OnboardingUpdatedPayload } from '@archie/api/onboarding-api/data-transfer-objects';
import { TRANSACTION_UPDATED_TOPIC } from '@archie/api/credit-api/constants';
import { TransactionUpdatedPayload } from '@archie/api/credit-api/data-transfer-objects';

@Controller()
export class EventQueueController {
  constructor(private eventService: EventService) {}

  static CONTROLLER_QUEUE_NAME = `${SERVICE_NAME}-event-${SERVICE_INSTANCE_ID}`;
  static CONTROLLER_QUEUE_SETTINGS = {
    requeueOnError: false,
    autoDelete: true,
    useIdempotency: false,
  };

  @Subscribe(
    LEDGER_ACCOUNT_UPDATED_TOPIC,
    EventQueueController.CONTROLLER_QUEUE_NAME,
    EventQueueController.CONTROLLER_QUEUE_SETTINGS,
  )
  async ledgerAccountUpdatedHandler({
    userId,
    ...payload
  }: LedgerAccountUpdatedPayload): Promise<void> {
    this.eventService.publishToClient(userId, {
      topic: LEDGER_ACCOUNT_UPDATED_TOPIC.getRoutingKey(),
      data: payload,
    });
  }

  @Subscribe(
    CREDIT_BALANCE_UPDATED_TOPIC,
    EventQueueController.CONTROLLER_QUEUE_NAME,
    EventQueueController.CONTROLLER_QUEUE_SETTINGS,
  )
  async creditBalanceUpdatedHandler({
    userId,
    ...payload
  }: CreditBalanceUpdatedPayload): Promise<void> {
    this.eventService.publishToClient(userId, {
      topic: CREDIT_BALANCE_UPDATED_TOPIC.getRoutingKey(),
      data: payload,
    });
  }

  @Subscribe(
    ONBOARDING_UPDATED_TOPIC,
    EventQueueController.CONTROLLER_QUEUE_NAME,
    EventQueueController.CONTROLLER_QUEUE_SETTINGS,
  )
  async onboardingUpdatedHandler({
    userId,
    ...payload
  }: OnboardingUpdatedPayload): Promise<void> {
    this.eventService.publishToClient(userId, {
      topic: ONBOARDING_UPDATED_TOPIC.getRoutingKey(),
      data: payload,
    });
  }

  @Subscribe(
    LTV_UPDATED_TOPIC,
    EventQueueController.CONTROLLER_QUEUE_NAME,
    EventQueueController.CONTROLLER_QUEUE_SETTINGS,
  )
  async ltvUpdatedHandler({
    userId,
    ...payload
  }: LtvUpdatedPayload): Promise<void> {
    this.eventService.publishToClient(userId, {
      topic: LTV_UPDATED_TOPIC.getRoutingKey(),
      data: payload,
    });
  }

  @Subscribe(
    TRANSACTION_UPDATED_TOPIC,
    EventQueueController.CONTROLLER_QUEUE_NAME,
    EventQueueController.CONTROLLER_QUEUE_SETTINGS,
  )
  async transactionUpdatedHandler({
    userId,
    ...payload
  }: TransactionUpdatedPayload): Promise<void> {
    this.eventService.publishToClient(userId, {
      topic: TRANSACTION_UPDATED_TOPIC.getRoutingKey(),
      data: payload,
    });
  }
}
