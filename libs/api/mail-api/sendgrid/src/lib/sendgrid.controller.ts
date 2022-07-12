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
import { ConfigService } from '@archie-microservices/config';
import { AppliedToWaitlistDto, JoinedWaitlistDto } from './sendgrid.dto';
import { SendgridService } from './sendgrid.service';

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
}