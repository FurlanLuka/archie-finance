import { Controller } from '@nestjs/common';
import { Subscribe } from '@archie/api/utils/queue';
import {
  APPLIED_TO_WAITLIST_TOPIC,
  JOINED_WAITLIST_TOPIC,
} from '@archie/api/referral-system-api/constants';
import {
  SERVICE_QUEUE_NAME,
  ConfigVariables,
} from '@archie/api/mail-api/constants';
import { ConfigService } from '@archie/api/utils/config';
import {
  AppliedToWaitlistDto,
  JoinedWaitlistDto,
  LtvLimitApproachingDto,
  MarginCallCompletedDto,
  MarginCallStartedDto,
} from './sendgrid.dto';
import { SendgridService } from './sendgrid.service';
import {
  LTV_LIMIT_APPROACHING_TOPIC,
  MARGIN_CALL_COMPLETED_TOPIC,
  MARGIN_CALL_STARTED_TOPIC,
} from '@archie/api/credit-api/constants';

@Controller()
export class SendgirdQueueController {
  private static CONTROLLER_QUEUE_NAME = `${SERVICE_QUEUE_NAME}-sendgrid`;

  constructor(
    private sendgridService: SendgridService,
    private configService: ConfigService,
  ) {}

  @Subscribe(
    APPLIED_TO_WAITLIST_TOPIC,
    SendgirdQueueController.CONTROLLER_QUEUE_NAME,
  )
  async appliedToWaitlistEventHandler(
    payload: AppliedToWaitlistDto,
  ): Promise<void> {
    await this.sendgridService.sendEmail(
      payload.emailAddress,
      this.configService.get(
        ConfigVariables.SENDGRID_VERIFY_EMAIL_TEMPLATAE_ID,
      ),
      {
        verifyAddress: payload.verifyAddress,
      },
    );
  }

  @Subscribe(
    JOINED_WAITLIST_TOPIC,
    SendgirdQueueController.CONTROLLER_QUEUE_NAME,
  )
  async joinedWaitlistEventHandler(payload: JoinedWaitlistDto): Promise<void> {
    await this.sendgridService.addToWaitlist(payload.emailAddress);
  }

  @Subscribe(
    MARGIN_CALL_COMPLETED_TOPIC,
    SendgirdQueueController.CONTROLLER_QUEUE_NAME,
  )
  async marginCallCompletedHandler(
    payload: MarginCallCompletedDto,
  ): Promise<void> {
    await this.sendgridService.sendMarginCallCompletedMail(payload);
  }

  @Subscribe(
    MARGIN_CALL_STARTED_TOPIC,
    SendgirdQueueController.CONTROLLER_QUEUE_NAME,
  )
  async marginCallStartedHandler(payload: MarginCallStartedDto): Promise<void> {
    await this.sendgridService.sendMarginCallStartedMail(payload);
  }

  @Subscribe(
    LTV_LIMIT_APPROACHING_TOPIC,
    SendgirdQueueController.CONTROLLER_QUEUE_NAME,
  )
  async LtvLimitApproachingHandler(
    payload: LtvLimitApproachingDto,
  ): Promise<void> {
    await this.sendgridService.sendLtvLimitApproachingMail(payload);
  }
}
