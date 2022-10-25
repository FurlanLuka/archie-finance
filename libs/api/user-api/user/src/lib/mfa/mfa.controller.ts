import {
  AuthGuard,
  AuthScopes,
  ScopeGuard,
  Scopes,
} from '@archie/api/utils/auth0';
import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { MfaService } from './mfa.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ApiErrorResponse } from '@archie/api/utils/openapi';
import {
  GetEnrollmentResponse,
  GetEnrollmentsQuery,
  GetMfaEnrollmentResponse,
  GetSendEnrollmentTicketResponse,
  KycSubmittedPayload,
} from '@archie/api/user-api/data-transfer-objects';
import { EnrollmentNotFoundError } from './mfa.errors';
import { Subscribe } from '@archie/api/utils/queue/decorators/subscribe';
import {
  KYC_SUBMITTED_TOPIC,
  SERVICE_QUEUE_NAME,
} from '@archie/api/user-api/constants';

@Controller('v1/user/mfa')
export class MfaController {
  constructor(private mfaService: MfaService) {}

  @Post('enroll')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  async enrollMfa(@Req() request): Promise<GetSendEnrollmentTicketResponse> {
    return this.mfaService.enrollMfa(request.user.sub);
  }

  @Delete('enrollments/:enrollmentId')
  @UseGuards(AuthGuard, ScopeGuard)
  @Scopes(AuthScopes.mfa)
  @ApiBearerAuth()
  @ApiErrorResponse([EnrollmentNotFoundError])
  async deleteMfaEnrollment(
    @Req() request,
    @Param('enrollmentId') enrollmentId: string,
  ): Promise<void> {
    return this.mfaService.deleteMfaEnrollment(request.user.sub, enrollmentId);
  }

  @Get('enrollments')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  async getMfaEnrollments(
    @Req() request,
    @Query() query: GetEnrollmentsQuery,
  ): Promise<GetEnrollmentResponse[]> {
    return this.mfaService.getMfaEnrollments(request.user.sub, query);
  }

  @Get('enrollment')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  async isMfaEnrolled(@Req() request): Promise<GetMfaEnrollmentResponse> {
    return this.mfaService.isMfaEnrolled(request.user.sub);
  }
}

@Controller()
export class MfaQueueController {
  constructor(private mfaService: MfaService) {}

  private static CONTROLLER_QUEUE_NAME = `${SERVICE_QUEUE_NAME}-mfa`;

  @Subscribe(KYC_SUBMITTED_TOPIC, MfaQueueController.CONTROLLER_QUEUE_NAME)
  async handleMfaEnrolledEvent(payload: KycSubmittedPayload): Promise<void> {
    return this.mfaService.addMfaRole(payload.userId);
  }
}
