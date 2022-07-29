import { AuthGuard } from '@archie/api/utils/auth0';
import {
  BadRequestException,
  Controller,
  Get,
  Logger,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  GetSendEnrollmentTicketResponse,
  GetEnrollmentResponse,
  GetEmailVerificationResponse,
  GetEmailAddressResponse,
  GetEmailAddressPayload,
} from './user.interfaces';
import { UserService } from './user.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ApiErrorResponse } from '@archie/api/utils/openapi';
import { GetMfaEnrollmentResponse } from './user.interfaces';
import {
  RequestHandler,
  RPCResponse,
  RPCResponseType,
} from '@archie/api/utils/queue';
import {
  GET_USER_EMAIL_ADDRESS_RPC,
  SERVICE_QUEUE_NAME,
} from '@archie/api/user-api/constants';

@Controller('v1/user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('email-verification')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  async checkEmailVerification(
    @Req() request,
  ): Promise<GetEmailVerificationResponse> {
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
  async enrollMfa(@Req() request): Promise<GetSendEnrollmentTicketResponse> {
    return this.userService.enrollMfa(request.user.sub);
  }

  @Get('mfa/enrollments')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  async getMfaEnrollments(@Req() request): Promise<GetEnrollmentResponse[]> {
    return this.userService.getMfaEnrollments(request.user.sub);
  }

  @Get('mfa/enrollment')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  async isMfaEnrolled(@Req() request): Promise<GetMfaEnrollmentResponse> {
    return this.userService.isMfaEnrolled(request.user.sub);
  }
}

@Controller()
export class UserQueueController {
  constructor(private userService: UserService) {}

  @RequestHandler(GET_USER_EMAIL_ADDRESS_RPC, SERVICE_QUEUE_NAME)
  async getEmailAddress(
    payload: GetEmailAddressPayload,
  ): Promise<RPCResponse<GetEmailAddressResponse>> {
    Logger.log(`here111: ${Logger.log(payload)}`);
    try {
      const data = await this.userService.getEmailAddress(payload.userId);

      Logger.log(data);

      return {
        type: RPCResponseType.SUCCESS,
        data,
      };
    } catch (error) {
      Logger.error(error);
      
      return {
        type: RPCResponseType.ERROR,
        message: error.message,
      };
    }
  }
}
