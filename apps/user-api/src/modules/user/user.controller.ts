import { AuthGuard } from '@archie-microservices/auth0';
import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { GetEmailVerificationResponse } from './user.interfaces';
import { UserService } from './user.service';

@Controller('v1/user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('email-verification')
  @UseGuards(AuthGuard)
  async checkEmailVerification(
    @Req() request,
  ): Promise<GetEmailVerificationResponse> {
    return this.userService.isEmailVerified(request.user.sub);
  }

  @Post('email-verification/resend')
  @UseGuards(AuthGuard)
  async resendEmailVerification(@Req() request): Promise<void> {
    return this.userService.resendEmailVerification(request.user.sub);
  }
}
