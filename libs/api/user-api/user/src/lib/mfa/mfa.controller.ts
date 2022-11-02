import { AuthGuard } from '@archie/api/utils/auth0';
import { Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { MfaService } from './mfa.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ApiErrorResponse } from '@archie/api/utils/openapi';
import {
  EnrollmentDto,
  GetSendEnrollmentTicketResponseDto,
  MfaEnrollmentDto,
} from '@archie/api/user-api/data-transfer-objects';
import { EnrollmentNotFoundError } from './mfa.errors';

@Controller('v1/user/mfa')
export class MfaController {
  constructor(private userService: MfaService) {}

  @Post('enroll')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  async enrollMfa(@Req() request): Promise<GetSendEnrollmentTicketResponseDto> {
    return this.userService.enrollMfa(request.user.sub);
  }

  @Delete('enrollments/:enrollmentId')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiErrorResponse([EnrollmentNotFoundError])
  async deleteMfaEnrollment(@Req() request, @Param('enrollmentId') enrollmentId: string): Promise<void> {
    return this.userService.deleteMfaEnrollment(request.user.sub, enrollmentId);
  }

  @Get('enrollments')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  async getMfaEnrollments(@Req() request): Promise<EnrollmentDto[]> {
    return this.userService.getMfaEnrollments(request.user.sub);
  }

  @Get('enrollment')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  async isMfaEnrolled(@Req() request): Promise<MfaEnrollmentDto> {
    return this.userService.isMfaEnrolled(request.user.sub);
  }
}
