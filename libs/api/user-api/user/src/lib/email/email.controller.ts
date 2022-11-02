import { AuthGuard } from '@archie/api/utils/auth0';
import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { EmailService } from './email.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ApiErrorResponse } from '@archie/api/utils/openapi';
import { RPCResponse, RPCResponseType } from '@archie/api/utils/queue';
import { RequestHandler } from '@archie/api/utils/queue/decorators/request_handler';
import {
  GET_USER_EMAIL_ADDRESS_RPC,
  SERVICE_QUEUE_NAME,
} from '@archie/api/user-api/constants';
import {
  GetEmailAddressPayload,
  GetEmailAddressResponse,
  GetEmailVerificationResponse,
} from '@archie/api/user-api/data-transfer-objects';
import { EmailAlreadyVerifiedError } from './email.errors';

@Controller('v1/user/email-verification')
export class EmailController {
  constructor(private emailService: EmailService) {}

  @Get()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  async checkEmailVerification(
    @Req() request,
  ): Promise<GetEmailVerificationResponse> {
    return this.emailService.isEmailVerified(request.user.sub);
  }

  @Post('resend')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiErrorResponse([EmailAlreadyVerifiedError])
  async resendEmailVerification(@Req() request): Promise<void> {
    return this.emailService.resendEmailVerification(request.user.sub);
  }
}

@Controller()
export class EmailQueueController {
  private static CONTROLLER_QUEUE_NAME = `${SERVICE_QUEUE_NAME}-user`;

  constructor(private userService: EmailService) {}

  @RequestHandler(
    GET_USER_EMAIL_ADDRESS_RPC,
    EmailQueueController.CONTROLLER_QUEUE_NAME,
  )
  async getEmailAddress(
    payload: GetEmailAddressPayload,
  ): Promise<RPCResponse<GetEmailAddressResponse>> {
    try {
      const data = await this.userService.getEmailAddress(payload.userId);

      return {
        type: RPCResponseType.SUCCESS,
        data,
      };
    } catch (error) {
      return {
        type: RPCResponseType.ERROR,
        message: error.message,
      };
    }
  }
}
