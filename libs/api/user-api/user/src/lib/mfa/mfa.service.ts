import { Injectable } from '@nestjs/common';
import { Enrollment, SendEnrollmentTicketResponse } from 'auth0';
import { Auth0Service } from '@archie/api/user-api/auth0';
import {
  MFA_REMOVED_TOPIC,
  MFA_ENROLLED_TOPIC,
} from '@archie/api/user-api/constants';
import { QueueService } from '@archie/api/utils/queue';
import { GetMfaEnrollmentResponse } from '@archie/api/user-api/data-transfer-objects';
import { EnrollmentNotFoundError } from './mfa.errors';

@Injectable()
export class MfaService {
  MFA_ROLE_ID = 'rol_8iZfnq4Ds6hdFojy';

  constructor(
    private auth0Service: Auth0Service,
    private queueService: QueueService,
  ) {}

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

    this.queueService.publishEvent(MFA_REMOVED_TOPIC, {
      userId,
    });
  }
}
