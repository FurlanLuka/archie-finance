import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { FinishPhoneVerificationPayload } from '@archie-microservices/api-interfaces/apto';
import { AptoService } from './apto.service';
import { AuthGuard } from '@archie-microservices/auth0';

@Controller('v1/apto')
export class AptoController {
  constructor(private aptoService: AptoService) {}

  @Post('verification/start')
  @UseGuards(AuthGuard)
  public async startPhoneVerification(@Request() req): Promise<void> {
    return this.aptoService.startPhoneVerification(req.user.sub);
  }

  @Post('verification/finish')
  @UseGuards(AuthGuard)
  public async finishPhoneVerification(
    @Request() req,
    @Body() body: FinishPhoneVerificationPayload,
  ): Promise<void> {
    return this.aptoService.finishPhoneVerification(req.user.sub, body.secret);
  }

  @Post('verification/restart')
  @UseGuards(AuthGuard)
  public async restartPhoneVerification(@Request() req): Promise<void> {
    return this.aptoService.restartVerification(req.user.sub);
  }
}
