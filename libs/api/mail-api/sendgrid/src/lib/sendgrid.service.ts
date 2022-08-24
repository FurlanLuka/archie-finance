import { Injectable } from '@nestjs/common';
import axios, { AxiosError } from 'axios';
import { ConfigService } from '@archie/api/utils/config';
import { ConfigVariables } from '@archie/api/mail-api/constants';
import { SendEmailInternalError } from './sendgrid.errors';
import { EmailDataFactoryService } from '@archie/api/mail-api/utils/email-data-factory';
import { ContactService, DecryptedContact } from '@archie/api/mail-api/contact';
import {
  LtvLimitApproachingPayload,
  MarginCallCompletedPayload,
  MarginCallStartedPayload,
} from '@archie/api/credit-api/data-transfer-objects';

@Injectable()
export class SendgridService {
  constructor(
    private configService: ConfigService,
    private emailDataFactory: EmailDataFactoryService,
    private contactService: ContactService,
  ) {}

  public async sendMarginCallCompletedMail(
    marginCall: MarginCallCompletedPayload,
  ) {
    const contact: DecryptedContact = await this.contactService.getContact(
      marginCall.userId,
    );

    if (marginCall.liquidationAmount > 0) {
      await this.sendEmail(
        contact.email,
        this.configService.get(
          ConfigVariables.SENDGRID_COLLATERAL_LIQUIDATED_TEMPLATE_ID,
        ),
        this.emailDataFactory.createCollateralLiquidatedMail(
          contact.firstName,
          marginCall,
        ),
      );
    } else {
      await this.sendEmail(
        contact.email,
        this.configService.get(
          ConfigVariables.SENDGRID_MARGIN_CALL_EXITED_TEMPLATE_ID,
        ),
        this.emailDataFactory.createInfoData(contact.firstName, marginCall),
      );
    }
  }

  public async sendMarginCallStartedMail(marginCall: MarginCallStartedPayload) {
    const contact: DecryptedContact = await this.contactService.getContact(
      marginCall.userId,
    );

    await this.sendEmail(
      contact.email,
      this.configService.get(
        ConfigVariables.SENDGRID_MARGIN_CALL_REACHED_TEMPLATE_ID,
      ),
      this.emailDataFactory.createInfoData(contact.firstName, marginCall),
    );
  }

  public async sendLtvLimitApproachingMail(
    marginCall: LtvLimitApproachingPayload,
  ) {
    const contact: DecryptedContact = await this.contactService.getContact(
      marginCall.userId,
    );

    await this.sendEmail(
      contact.email,
      this.configService.get(
        ConfigVariables.SENDGRID_MARGIN_CALL_IN_DANGER_TEMPLATE_ID,
      ),
      this.emailDataFactory.createInfoData(contact.firstName, marginCall),
    );
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
