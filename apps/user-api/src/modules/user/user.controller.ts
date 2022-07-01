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
} from './user.dto';
import { UserService } from './user.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ApiErrorResponse } from '@archie-microservices/openapi';

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
