import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { FinishPhoneVerificationDto } from '@archie-microservices/api-interfaces/apto';
import { AptoService } from './apto.service';
import { AuthGuard } from '@archie-microservices/auth0';
import {
  CreateUserResponse,
  IssueCardResponse,
  StartPhoneVerificationResponse,
  CompletePhoneVerificationResponse,
} from './apto.dto';

@Controller('v1/apto')
export class AptoController {
  constructor(private aptoService: AptoService) {}

  @Post('verification/start')
  @UseGuards(AuthGuard)
  public async startPhoneVerification(
    @Request() req,
  ): Promise<StartPhoneVerificationResponse> {
    return this.aptoService.startPhoneVerification(req.user.sub);
  }

  @Post('verification/finish')
  @UseGuards(AuthGuard)
  public async finishPhoneVerification(
    @Request() req,
    @Body() body: FinishPhoneVerificationDto,
  ): Promise<CompletePhoneVerificationResponse> {
    return this.aptoService.finishPhoneVerification(req.user.sub, body.secret);
  }

  @Post('verification/restart')
  @UseGuards(AuthGuard)
  public async restartPhoneVerification(
    @Request() req,
  ): Promise<StartPhoneVerificationResponse> {
    return this.aptoService.restartVerification(req.user.sub);
  }

  @Post('user')
  @UseGuards(AuthGuard)
  public async createUser(@Request() req): Promise<CreateUserResponse> {
    return this.aptoService.createAptoUser(req.user.sub);
  }

  @Post('user/card')
  @UseGuards(AuthGuard)
  public async applyForCard(@Request() req): Promise<IssueCardResponse> {
    return this.aptoService.issueCard(req.user.sub);
  }
}
