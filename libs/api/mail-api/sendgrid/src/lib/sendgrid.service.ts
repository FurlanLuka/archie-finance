import { Injectable } from '@nestjs/common';
import axios, { AxiosError } from 'axios';
import { ConfigService } from '@archie/api/utils/config';
import { ConfigVariables } from '@archie/api/mail-api/constants';
import { SendEmailInternalError } from './sendgrid.errors';
import {
  DecryptedContact,
  LtvLimitApproaching,
  MarginCallCompleted,
  MarginCallStarted,
} from './sendgrid.interfaces';
import { EmailDataFactoryService } from '@archie/api/mail-api/utils/email-data-factory';
import { CryptoService } from '@archie/api/utils/crypto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contact } from './contact.entity';

@Injectable()
export class SendgridService {
  constructor(
    private configService: ConfigService,
    private emailDataFactory: EmailDataFactoryService,
    private cryptoService: CryptoService,
    @InjectRepository(Contact) private contactRepository: Repository<Contact>,
  ) {}

  private async getContact(userId: string): Promise<DecryptedContact> {
    const contact: Contact = await this.contactRepository.findOneBy({
      userId,
    });

    const [firstName, email] = this.cryptoService.decryptMultiple([
      contact.encryptedFirstName,
      contact.encryptedEmail,
    ]);

    return { firstName, email };
  }

  public async saveFirstName(userId: string, firstName: string): Promise<void> {
    const encryptedFirstName: string = this.cryptoService.encrypt(firstName);

    await this.contactRepository.upsert(
      {
        userId,
        encryptedFirstName,
      },
      {
        conflictPaths: ['userId'],
      },
    );
  }

  public async saveEmail(userId: string, email: string): Promise<void> {
    const encryptedEmail: string = this.cryptoService.encrypt(email);

    await this.contactRepository.upsert(
      {
        userId,
        encryptedEmail,
      },
      {
        conflictPaths: ['userId'],
      },
    );
  }

  public async sendMarginCallCompletedMail(marginCall: MarginCallCompleted) {
    const contact: DecryptedContact = await this.getContact(marginCall.userId);

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

  public async sendMarginCallStartedMail(marginCall: MarginCallStarted) {
    const contact: DecryptedContact = await this.getContact(marginCall.userId);

    await this.sendEmail(
      contact.email,
      this.configService.get(
        ConfigVariables.SENDGRID_MARGIN_CALL_REACHED_TEMPLATE_ID,
      ),
      this.emailDataFactory.createInfoData(contact.firstName, marginCall),
    );
  }

  public async sendLtvLimitApproachingMail(marginCall: LtvLimitApproaching) {
    const contact: DecryptedContact = await this.getContact(marginCall.userId);

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
