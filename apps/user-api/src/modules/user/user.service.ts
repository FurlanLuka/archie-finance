import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from 'auth0';
import { Auth0Service } from '../auth0/auth0.service';
import { GetEmailVerificationResponse } from './user.interfaces';
import { GetEmailAddressResponse } from '@archie-microservices/api-interfaces/user';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { EMAIL_VERIFIED_EXCHANGE } from '@archie/api/user-api/constants';

@Injectable()
export class UserService {
  constructor(
    private auth0Service: Auth0Service,
    private amqpConnection: AmqpConnection,
  ) {}

  async isEmailVerified(userId: string): Promise<GetEmailVerificationResponse> {
    const user: User = await this.auth0Service.getManagmentClient().getUser({
      id: userId,
    });

    if (user.email_verified) {
      this.amqpConnection.publish(EMAIL_VERIFIED_EXCHANGE.name, '', {
        userId,
      });
    }

    return {
      isVerified: user.email_verified,
    };
  }

  async getEmailAddress(userId: string): Promise<GetEmailAddressResponse> {
    const user: User = await this.auth0Service.getManagmentClient().getUser({
      id: userId,
    });

    if (user.email === undefined) {
      throw new NotFoundException();
    }

    return {
      email: user.email,
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
