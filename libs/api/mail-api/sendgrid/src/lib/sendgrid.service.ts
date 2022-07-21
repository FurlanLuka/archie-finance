import { Injectable } from '@nestjs/common';
import axios, { AxiosError } from 'axios';
import { ConfigService } from '@archie/api/utils/config';
import { ConfigVariables } from '@archie/api/mail-api/constants';
import { SendEmailInternalError } from './sendgrid.errors';
import { InternalApiService } from '@archie-microservices/internal-api';
import { GetEmailAddressResponse } from '@archie-microservices/api-interfaces/user';
import {
  Liquidation,
  LtvLimitApproaching,
  MarginCallCompleted,
  MarginCallStarted,
} from './sendgrid.interfaces';
import { InternalApiService } from '@archie/api/utils/internal';
import { GetEmailAddressResponse } from '@archie/api/utils/interfaces/user';

@Injectable()
export class SendgridService {
  constructor(
    private configService: ConfigService,
    private internalApiService: InternalApiService,
  ) {}

  public async sendMarginCallCompletedMail(marginCall: MarginCallCompleted) {
    const emailAddress: GetEmailAddressResponse =
      await this.internalApiService.getUserEmailAddress(marginCall.userId);

    if (marginCall.liquidation.length > 0) {
      // TODO: send assets were liquidated email
    } else {
      // TODO: send assets were not liquidated mail (user payed back / crypto went up again in the 72 hour span)
    }
  }

  public async sendMarginCallStartedMail(marginCall: MarginCallStarted) {
    const emailAddress: GetEmailAddressResponse =
      await this.internalApiService.getUserEmailAddress(marginCall.userId);

    // TODO: send margin call started mail - user has 72 hours to pay up
  }

  public async sendLtvLimitApproachingMail(marginCall: LtvLimitApproaching) {
    const emailAddress: GetEmailAddressResponse =
      await this.internalApiService.getUserEmailAddress(marginCall.userId);

    // TODO: send ltv limit approaching mail
  }

  public async addToWaitlist(emailAddress: string) {
    await axios.put(
      `${this.configService.get(
        ConfigVariables.SENDGRID_API_URL,
      )}/v3/marketing/contacts`,
      {
        contacts: [
          {
            email: emailAddress,
          },
        ],
        list_ids: [
          this.configService.get(ConfigVariables.SENDGRID_MAILING_LIST_ID),
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${this.configService.get(
            ConfigVariables.SENDGRID_API_KEY,
          )}`,
        },
      },
    );
  }

  public async sendEmail(
    emailAddress: string,
    emailTemplateId: string,
    emailData: unknown,
  ) {
    try {
      await axios.post(
        `${this.configService.get(
          ConfigVariables.SENDGRID_API_URL,
        )}/v3/mail/send`,
        {
          from: {
            email: 'no-reply@archie.finance',
          },
          personalizations: [
            {
              to: [
                {
                  email: emailAddress,
                },
              ],
              dynamic_template_data: emailData,
            },
          ],
          template_id: emailTemplateId,
        },
        {
          headers: {
            Authorization: `Bearer ${this.configService.get(
              ConfigVariables.SENDGRID_API_KEY,
            )}`,
          },
        },
      );
    } catch (error) {
      throw new SendEmailInternalError({
        id: emailTemplateId,
        error: JSON.stringify(error as AxiosError),
      });
    }
  }
}
