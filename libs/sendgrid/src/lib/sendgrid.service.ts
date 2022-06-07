import { Inject, Injectable, Logger } from '@nestjs/common';
import { SendgridConfig } from './sendgrid.interfaces';
import * as sendgrid from '@sendgrid/mail';

@Injectable()
export class SendgridService {
  constructor(@Inject('SENDGRID_CONFIG') config: SendgridConfig) {
    sendgrid.setApiKey(config.apiKey);
  }

  public async sendEmail(data: sendgrid.MailDataRequired): Promise<void> {
    try {
      await sendgrid.send(data);
    } catch (error) {
      Logger.error({
        code: 'SENDING_EMAIL_ERROR',
        metadata: {
          error: JSON.stringify(error),
        },
      });
    }
  }

  public async sendWelcomeEmail(
    name: string,
    emailAddress: string,
  ): Promise<void> {
    return this.sendEmail({
      to: {
        email: emailAddress,
        name,
      },
      from: {
        email: 'no-reply@archie.finance',
        name: 'No-Reply',
      },
      subject: 'Welcome to Archie Finance!',
      templateId: 'fd548ac0-5e2c-4948-a94d-b87b3a016d61',
      customArgs: {
        name,
      },
    });
  }
}
