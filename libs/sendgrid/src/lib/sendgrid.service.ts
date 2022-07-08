import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import axios, { AxiosError } from 'axios';
import { SendgridConfig } from './sendgrid.interfaces';
import {
  AddToEmailWaitlistInternalError,
  SendEmailInternalError,
} from './sendgrid.errors';

@Injectable()
export class SendgridService {
  constructor(@Inject('SENDGRID_CONFIG') private config: SendgridConfig) {}

  public async addToWaitlist(emailAddress: string, waitlistId: string) {
    try {
      await axios.put(
        `${this.config.API_URL}/v3/marketing/contacts`,
        {
          contacts: [
            {
              email: emailAddress,
            },
          ],
          list_ids: [this.config.MAILING_LIST_ID],
        },
        {
          headers: {
            Authorization: `Bearer ${this.config.API_KEY}`,
          },
        },
      );
    } catch (error) {
      throw new AddToEmailWaitlistInternalError({
        id: waitlistId,
      });
    }
  }

  public async sendEmail(
    emailAddress: string,
    emailTemplateId: string,
    emailData: unknown,
  ) {
    try {
      await axios.post(
        `${this.config.API_URL}/v3/mail/send`,
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
            Authorization: `Bearer ${this.config.API_KEY}`,
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
