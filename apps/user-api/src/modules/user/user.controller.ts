import { AuthGuard } from '@archie-microservices/auth0';
import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  GetEmailVerificationResponseDto,
  GetEmailAddressResponseDto,
  GetSendEnrollmentTicketResponseDto,
  EnrollmentDto,
} from './user.dto';
import { UserService } from './user.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ApiErrorResponse } from '@archie-microservices/openapi';
import { GetMfaEnrollmentResponse } from './user.interfaces';

@Controller('v1/user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('email-verification')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  async checkEmailVerification(
    @Req() request,
  ): Promise<GetEmailVerificationResponseDto> {
    return this.userService.isEmailVerified(request.user.sub);
  }

  @Post('email-verification/resend')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiErrorResponse([BadRequestException])
  async resendEmailVerification(@Req() request): Promise<void> {
    return this.userService.resendEmailVerification(request.user.sub);
  }

  @Post('mfa/enroll')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  async enrollMfa(@Req() request): Promise<GetSendEnrollmentTicketResponseDto> {
    return this.userService.enrollMfa(request.user.sub);
  }

  @Get('mfa/enrollments')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  async getMfaEnrollments(@Req() request): Promise<EnrollmentDto[]> {
    return this.userService.getMfaEnrollments(request.user.sub);
  }

  @Get('mfa/enrollment')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  async isMfaEnrolled(@Req() request): Promise<GetMfaEnrollmentResponse> {
    return this.userService.isMfaEnrolled(request.user.sub);
  }
}

@Controller('internal/user')
export class InternalUserController {
  constructor(private userService: UserService) {}

  @Get('email-address/:userId')
  @ApiErrorResponse([NotFoundException])
  async getEmailAddress(
    @Param('userId') userId: string,
  ): Promise<GetEmailAddressResponseDto> {
    return this.userService.getEmailAddress(userId);
  }
}
