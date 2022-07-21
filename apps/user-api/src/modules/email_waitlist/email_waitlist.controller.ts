import {
  Body,
  Controller,
  InternalServerErrorException,
  Logger,
  Put,
} from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@archie/api/utils/config';
import { EmailWaitlistDto } from './email_waitlist.dto';
import { ConfigVariables } from '@archie/api/user-api/constants';
import { AddToEmailWaitlistInternalError } from './email_waitlist.errors';

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
      throw new AddToEmailWaitlistInternalError({
        email: body.emailAddress,
      });
    }
  }
}
