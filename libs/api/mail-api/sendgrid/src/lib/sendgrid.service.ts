import { Injectable } from '@nestjs/common';
import axios, { AxiosError } from 'axios';
import { ConfigService } from '@archie/api/utils/config';
import { ConfigVariables } from '@archie/api/mail-api/constants';
import { SendEmailInternalError } from './sendgrid.errors';
import { EmailDataFactoryService } from '@archie/api/mail-api/utils/email-data-factory';
import { ContactService, DecryptedContact } from '@archie/api/mail-api/contact';
import {
  MarginCallLtvLimitApproachingPayload,
  MarginCallCompletedPayload,
  MarginCallStartedPayload,
} from '@archie/api/ltv-api/data-transfer-objects/types';
import { SalesConnectDto } from '@archie/api/referral-system-api/sales-connect';

@Injectable()
export class SendgridService {
  constructor(
    private configService: ConfigService,
    private emailDataFactory: EmailDataFactoryService,
    private contactService: ContactService,
  ) {}

  public async sendMarginCallCompletedMail(
    marginCall: MarginCallCompletedPayload,
  ): Promise<void> {
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

  public async sendMarginCallStartedMail(
    marginCall: MarginCallStartedPayload,
  ): Promise<void> {
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
    marginCall: MarginCallLtvLimitApproachingPayload,
  ): Promise<void> {
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

  public async sendSalesConnectEmail(payload: SalesConnectDto): Promise<void> {
    await this.sendEmail(
      'sales@archie.finance',
      this.configService.get(
        ConfigVariables.SENDGRID_CONNECT_SALES_TEMPLATE_ID,
      ),
      payload,
    );
  }

  public async addToWaitlist(emailAddress: string): Promise<void> {
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
  ): Promise<void> {
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
