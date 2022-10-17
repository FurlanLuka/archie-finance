import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Enrollment, SendEnrollmentTicketResponse, User } from 'auth0';
import { Auth0Service } from '@archie/api/user-api/auth0';
import {
  EMAIL_VERIFIED_TOPIC,
  MFA_ENROLLED_TOPIC,
} from '@archie/api/user-api/constants';
import { QueueService } from '@archie/api/utils/queue';
import {
  EmailVerifiedPayload,
  GetEmailAddressResponse,
  GetEmailVerificationResponse,
  GetMfaEnrollmentResponse,
  MfaEnrolledPayload,
} from '@archie/api/user-api/data-transfer-objects';
import { EnrollmentNotFoundError } from './user.errors';

@Injectable()
export class UserService {
  constructor(
    private auth0Service: Auth0Service,
    private queueService: QueueService,
  ) {}

  async isEmailVerified(userId: string): Promise<GetEmailVerificationResponse> {
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
    const emailVerified: boolean = <boolean>user.email_verified;

    if (emailVerified) {
      throw new BadRequestException(
        'EMAIL_ALREADY_VERIFIED',
        'Your email has already been verified.',
      );
    }

    await this.auth0Service.getManagmentClient().sendEmailVerification({
      user_id: userId,
    });
  }

  async enrollMfa(userId: string): Promise<SendEnrollmentTicketResponse> {
    return this.auth0Service
      .getManagmentClient()
      .createGuardianEnrollmentTicket({
        user_id: userId,
      });
  }

  async isMfaEnrolled(userId: string): Promise<GetMfaEnrollmentResponse> {
    const enrollments: Enrollment[] = await this.auth0Service
      .getManagmentClient()
      .getGuardianEnrollments({
        id: userId,
      });

    const hasEnrolledAuthenticator: Enrollment | undefined = enrollments.find(
      (enrollment) => {
        return (
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          enrollment.auth_method === 'authenticator' &&
          enrollment.status === 'confirmed'
        );
      },
    );

    if (hasEnrolledAuthenticator !== undefined) {
      this.queueService.publishEvent(MFA_ENROLLED_TOPIC, {
        userId,
      });
    }

    return {
      isEnrolled: hasEnrolledAuthenticator !== undefined,
    };
  }

  async getMfaEnrollments(userId: string): Promise<Enrollment[]> {
    return this.auth0Service.getManagmentClient().getGuardianEnrollments({
      id: userId,
    });
  }

  async deleteMfaEnrollment(
    userId: string,
    enrollmentId: string,
  ): Promise<void> {
    const enrollments: Enrollment[] = await this.getMfaEnrollments(userId);

    const enrollmentExists: boolean = enrollments.some(
      (enrollment) => enrollment.id === enrollmentId,
    );

    if (!enrollmentExists) {
      throw new EnrollmentNotFoundError();
    }

    await this.auth0Service.getManagmentClient().deleteGuardianEnrollment({
      id: enrollmentId,
    });
  }
}
