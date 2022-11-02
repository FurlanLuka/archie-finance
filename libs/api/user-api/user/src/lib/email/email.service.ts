import { Injectable } from '@nestjs/common';
import { User } from 'auth0';
import { Auth0Service } from '@archie/api/user-api/auth0';
import { EMAIL_VERIFIED_TOPIC } from '@archie/api/user-api/constants';
import { QueueService } from '@archie/api/utils/queue';
import { EmailAlreadyVerifiedError, EmailNotFoundError } from './email.errors';
import { EmailAddress, EmailVerification } from '@archie/api/user-api/data-transfer-objects/types';

@Injectable()
export class EmailService {
  constructor(
    private auth0Service: Auth0Service,
    private queueService: QueueService,
  ) {}

  async isEmailVerified(userId: string): Promise<EmailVerification> {
    const user: User = await this.auth0Service.getManagmentClient().getUser({
      id: userId,
    });
    const emailVerified: boolean = <boolean>user.email_verified;
    const email: string = <string>user.email;

    if (emailVerified) {
      this.queueService.publishEvent(EMAIL_VERIFIED_TOPIC, {
        userId,
        email,
      });
    }

    return {
      isVerified: emailVerified,
      email,
    };
  }

  async getEmailAddress(userId: string): Promise<EmailAddress> {
    const user: User = await this.auth0Service.getManagmentClient().getUser({
      id: userId,
    });

    if (user.email === undefined) {
      throw new EmailNotFoundError();
    }

    return {
      email: user.email,
    };
  }

  async resendEmailVerification(userId: string): Promise<void> {
    const user: User = await this.auth0Service.getManagmentClient().getUser({
      id: userId,
    });
    const emailVerified: boolean = <boolean>user.email_verified;

    if (emailVerified) {
      throw new EmailAlreadyVerifiedError();
    }

    await this.auth0Service.getManagmentClient().sendEmailVerification({
      user_id: userId,
    });
  }
}
