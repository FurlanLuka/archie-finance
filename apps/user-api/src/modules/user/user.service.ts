import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from 'auth0';
import { Auth0Service } from '../auth0/auth0.service';
import { GetEmailVerificationResponse } from './user.interfaces';

@Injectable()
export class UserService {
  constructor(private auth0Service: Auth0Service) {}

  async isEmailVerified(userId: string): Promise<GetEmailVerificationResponse> {
    const user: User = await this.auth0Service.getManagmentClient().getUser({
      id: userId,
    });

    return {
      isVerified: user.email_verified,
    };
  }

  async resendEmailVerification(userId: string): Promise<void> {
    const user: User = await this.auth0Service.getManagmentClient().getUser({
      id: userId,
    });

    if (user.email_verified) {
      throw new BadRequestException(
        'EMAIL_ALREADY_VERIFIED',
        'Your email has already been verified.',
      );
    }

    await this.auth0Service.getManagmentClient().sendEmailVerification({
      user_id: userId,
    });
  }
}