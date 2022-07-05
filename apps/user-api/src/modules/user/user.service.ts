import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from 'auth0';
import { Auth0Service } from '../auth0/auth0.service';
import { GetEmailVerificationResponse } from './user.interfaces';
import { GetEmailAddressResponse } from '@archie-microservices/api-interfaces/user';
import {
  SERVICE_NAME as ONBOARDING_SERVICE_NAME,
  EventPatterns as OnboardingServiceEventPatterns,
} from '@archie/api/onboarding-api/constants';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class UserService {
  constructor(
    private auth0Service: Auth0Service,
    @Inject(ONBOARDING_SERVICE_NAME)
    private onboardingServiceClient: ClientProxy,
  ) {}

  async isEmailVerified(userId: string): Promise<GetEmailVerificationResponse> {
    const user: User = await this.auth0Service.getManagmentClient().getUser({
      id: userId,
    });

    if (user.email_verified) {
      this.onboardingServiceClient.emit(
        OnboardingServiceEventPatterns.COMPLETE_ONBOARDING_STAGE,
        {
          stage: 'emailVerificationStage',
          userId,
        },
      );
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
