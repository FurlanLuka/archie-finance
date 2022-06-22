import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import axios from 'axios';
import { SendgridConfig } from './sendgrid.interfaces';

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
      Logger.error({
        code: 'ADD_TO_EMAIL_WAITLIST_ERROR',
        metadata: {
          id: waitlistId,
        },
      });

      throw new InternalServerErrorException();
    }
  }

  public async sendEmail(
    emailAddress: string,
    emailTemplateId: string,
    emailData: unknown,
  ) {
    try {
      await axios.put(
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
          template_id: [emailTemplateId],
        },
        {
          headers: {
            Authorization: `Bearer ${this.config.API_KEY}`,
          },
        },
      );
    } catch (error) {
      Logger.error({
        code: 'ERROR_SENDING_EMAIL',
        metadata: {
          id: emailTemplateId,
        },
      });

      throw new InternalServerErrorException();
    }
  }
}
