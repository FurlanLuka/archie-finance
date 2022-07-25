import { Controller } from '@nestjs/common';
import { Subscribe } from '@archie/api/utils/queue';
import {
  APPLIED_TO_WAITLIST_EXCHANGE,
  JOINED_WAITLIST_EXCHANGE,
} from '@archie/api/referral-system-api/constants';
import {
  SERVICE_QUEUE_NAME,
  ConfigVariables,
} from '@archie/api/mail-api/constants';
import { ConfigService } from '@archie/api/utils/config';
import {
  AppliedToWaitlistDto,
  EmailVerifiedDto,
  JoinedWaitlistDto,
  KycSubmittedDto,
  LtvLimitApproachingDto,
  MarginCallCompletedDto,
  MarginCallStartedDto,
} from './sendgrid.dto';
import { SendgridService } from './sendgrid.service';
import {
  LTV_LIMIT_APPROACHING_EXCHANGE,
  MARGIN_CALL_COMPLETED_EXCHANGE,
  MARGIN_CALL_STARTED_EXCHANGE,
} from '@archie/api/credit-api/constants';
import {
  EMAIL_VERIFIED_EXCHANGE,
  KYC_SUBMITTED_EXCHANGE,
} from '@archie/api/user-api/constants';

@Controller()
export class SendgirdQueueController {
  constructor(
    private sendgridService: SendgridService,
    private configService: ConfigService,
  ) {}

  @Subscribe(APPLIED_TO_WAITLIST_EXCHANGE, SERVICE_QUEUE_NAME)
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

  @Subscribe(JOINED_WAITLIST_EXCHANGE, SERVICE_QUEUE_NAME)
  async joinedWaitlistEventHandler(payload: JoinedWaitlistDto): Promise<void> {
    await this.sendgridService.addToWaitlist(payload.emailAddress);
  }

  @Subscribe(MARGIN_CALL_COMPLETED_EXCHANGE, SERVICE_QUEUE_NAME)
  async marginCallCompletedHandler(
    payload: MarginCallCompletedDto,
  ): Promise<void> {
    await this.sendgridService.sendMarginCallCompletedMail(payload);
  }

  @Subscribe(MARGIN_CALL_STARTED_EXCHANGE, SERVICE_QUEUE_NAME)
  async marginCallStartedHandler(payload: MarginCallStartedDto): Promise<void> {
    await this.sendgridService.sendMarginCallStartedMail(payload);
  }

  @Subscribe(LTV_LIMIT_APPROACHING_EXCHANGE, SERVICE_QUEUE_NAME)
  async LtvLimitApproachingHandler(
    payload: LtvLimitApproachingDto,
  ): Promise<void> {
    await this.sendgridService.sendLtvLimitApproachingMail(payload);
  }

  @Subscribe(KYC_SUBMITTED_EXCHANGE, SERVICE_QUEUE_NAME)
  async kycSubmittedHandler(payload: KycSubmittedDto): Promise<void> {
    await this.sendgridService.saveFirstName(payload.userId, payload.firstName);
  }

  @Subscribe(EMAIL_VERIFIED_EXCHANGE, SERVICE_QUEUE_NAME)
  async emailVerifiedHandler(payload: EmailVerifiedDto): Promise<void> {
    await this.sendgridService.saveEmail(payload.userId, payload.email);
  }
}
