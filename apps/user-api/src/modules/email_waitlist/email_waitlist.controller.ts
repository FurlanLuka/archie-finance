import {
  Body,
  Controller,
  InternalServerErrorException,
  Logger,
  Put,
} from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@archie-microservices/config';
import { EmailWaitlistDto } from './email_waitlist.dto';
import { ConfigVariables } from '@archie/api/user-api/constants';

@Controller('v1/email_waitlist')
export class EmailWaitlistController {
  constructor(private configService: ConfigService) {}

  @Put()
  async addToWaitlist(@Body() body: EmailWaitlistDto): Promise<void> {
    try {
      await axios.put(
        'https://api.sendgrid.com/v3/marketing/contacts',
        {
          contacts: [
            {
              email: body.emailAddress,
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
    } catch (error) {
      Logger.error({
        code: 'ADD_TO_EMAIL_WAITLIST_ERROR',
        metadata: {
          email: body.emailAddress,
        },
      });

      throw new InternalServerErrorException();
    }
  }
}
