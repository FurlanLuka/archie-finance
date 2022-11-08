import { Controller } from '@nestjs/common';
import { Subscribe } from '@archie/api/utils/queue/decorators/subscribe';
import {
  APPLIED_TO_WAITLIST_TOPIC,
  JOINED_WAITLIST_TOPIC,
  SALES_CONNECT_TOPIC,
} from '@archie/api/referral-system-api/constants';
import { SERVICE_QUEUE_NAME, ConfigVariables } from '@archie/api/mail-api/constants';
import { ConfigService } from '@archie/api/utils/config';
import { SendgridService } from './sendgrid.service';
import {
  MARGIN_CALL_LTV_LIMIT_APPROACHING_TOPIC,
  MARGIN_CALL_COMPLETED_TOPIC,
  MARGIN_CALL_STARTED_TOPIC,
} from '@archie/api/ltv-api/constants';
import {
  AppliedToWaitlistPayload,
  JoinedToWaitlistPayload,
} from '@archie/api/referral-system-api/data-transfer-objects/types';
import {
  MarginCallLtvLimitApproachingPayload,
  MarginCallCompletedPayload,
  MarginCallStartedPayload,
} from '@archie/api/ltv-api/data-transfer-objects/types';
import { SalesConnectDto } from '@archie/api/referral-system-api/sales-connect';

@Controller()
export class SendgirdQueueController {
  private static CONTROLLER_QUEUE_NAME = `${SERVICE_QUEUE_NAME}-sendgrid`;

  constructor(private sendgridService: SendgridService, private configService: ConfigService) {}

  @Subscribe(APPLIED_TO_WAITLIST_TOPIC, SendgirdQueueController.CONTROLLER_QUEUE_NAME)
  async appliedToWaitlistEventHandler(payload: AppliedToWaitlistPayload): Promise<void> {
    await this.sendgridService.sendEmail(
      payload.emailAddress,
      this.configService.get(ConfigVariables.SENDGRID_VERIFY_EMAIL_TEMPLATAE_ID),
      {
        verifyAddress: payload.verifyAddress,
      },
    );
  }

  @Subscribe(JOINED_WAITLIST_TOPIC, SendgirdQueueController.CONTROLLER_QUEUE_NAME)
  async joinedWaitlistEventHandler(payload: JoinedToWaitlistPayload): Promise<void> {
    await this.sendgridService.addToWaitlist(payload.emailAddress);
  }

  @Subscribe(MARGIN_CALL_COMPLETED_TOPIC, SendgirdQueueController.CONTROLLER_QUEUE_NAME)
  async marginCallCompletedHandler(payload: MarginCallCompletedPayload): Promise<void> {
    await this.sendgridService.sendMarginCallCompletedMail(payload);
  }

  @Subscribe(MARGIN_CALL_STARTED_TOPIC, SendgirdQueueController.CONTROLLER_QUEUE_NAME)
  async marginCallStartedHandler(payload: MarginCallStartedPayload): Promise<void> {
    await this.sendgridService.sendMarginCallStartedMail(payload);
  }

  @Subscribe(MARGIN_CALL_LTV_LIMIT_APPROACHING_TOPIC, SendgirdQueueController.CONTROLLER_QUEUE_NAME)
  async LtvLimitApproachingHandler(payload: MarginCallLtvLimitApproachingPayload): Promise<void> {
    await this.sendgridService.sendLtvLimitApproachingMail(payload);
  }

  @Subscribe(SALES_CONNECT_TOPIC, SendgirdQueueController.CONTROLLER_QUEUE_NAME)
  async salesConnectHandler(payload: SalesConnectDto): Promise<void> {
    await this.sendgridService.sendSalesConnectEmail(payload);
  }
}
