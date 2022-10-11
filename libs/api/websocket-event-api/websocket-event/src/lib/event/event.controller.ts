import { Controller } from '@nestjs/common';
import { SERVICE_NAME } from '@archie/api/websocket-event-api/constants';
import { Subscribe } from '@archie/api/utils/queue';
import { LEDGER_ACCOUNT_UPDATED_TOPIC } from '@archie/api/ledger-api/constants';
import { LedgerAccountUpdatedPayload } from '@archie/api/ledger-api/data-transfer-objects';
import { EventService } from './event.service';
import { CREDIT_BALANCE_UPDATED_TOPIC } from '@archie/api/peach-api/constants';
import { CreditBalanceUpdatedPayload } from '@archie/api/peach-api/data-transfer-objects';
import {
  MARGIN_CALL_COMPLETED_TOPIC,
  MARGIN_CALL_STARTED_TOPIC,
} from '@archie/api/ltv-api/constants';
import {
  MarginCallCompletedPayload,
  MarginCallStartedPayload,
} from '@archie/api/ltv-api/data-transfer-objects';

@Controller()
export class EventQueueController {
  constructor(private eventService: EventService) {}

  static CONTROLLER_QUEUE_NAME = `${SERVICE_NAME}-event`;
  static CONTROLLER_QUEUE_SETTINGS = {
    logBody: false,
    requeueOnError: false,
  };

  @Subscribe(
    LEDGER_ACCOUNT_UPDATED_TOPIC,
    EventQueueController.CONTROLLER_QUEUE_NAME,
    EventQueueController.CONTROLLER_QUEUE_SETTINGS,
  )
  async ledgerAccountUpdatedHandler({
    userId,
    ...payload
  }: LedgerAccountUpdatedPayload) {
    this.eventService.publishToClient(userId, {
      subject: LEDGER_ACCOUNT_UPDATED_TOPIC,
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
  }: CreditBalanceUpdatedPayload) {
    this.eventService.publishToClient(userId, {
      subject: CREDIT_BALANCE_UPDATED_TOPIC,
      data: payload,
    });
  }

  @Subscribe(
    MARGIN_CALL_STARTED_TOPIC,
    EventQueueController.CONTROLLER_QUEUE_NAME,
    EventQueueController.CONTROLLER_QUEUE_SETTINGS,
  )
  async marginCallStartedHandler({
    userId,
    ...payload
  }: MarginCallStartedPayload) {
    this.eventService.publishToClient(userId, {
      subject: MARGIN_CALL_STARTED_TOPIC,
      data: payload,
    });
  }

  @Subscribe(
    MARGIN_CALL_COMPLETED_TOPIC,
    EventQueueController.CONTROLLER_QUEUE_NAME,
    EventQueueController.CONTROLLER_QUEUE_SETTINGS,
  )
  async marginCallCompletedHandler({
    userId,
    ...payload
  }: MarginCallCompletedPayload) {
    this.eventService.publishToClient(userId, {
      subject: MARGIN_CALL_STARTED_TOPIC,
      data: payload,
    });
  }
}
