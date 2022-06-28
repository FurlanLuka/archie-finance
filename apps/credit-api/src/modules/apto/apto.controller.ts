import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { FinishPhoneVerificationDto } from '@archie-microservices/api-interfaces/apto';
import { AptoService } from './apto.service';
import { AuthGuard } from '@archie-microservices/auth0';
import {
  CreateUserResponseDto,
  IssueCardResponseDto,
  StartPhoneVerificationResponseDto,
  CompletePhoneVerificationResponseDto,
} from './apto.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('v1/apto')
export class AptoController {
  constructor(private aptoService: AptoService) {}

  @Post('verification/start')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  public async startPhoneVerification(
    @Request() req,
  ): Promise<StartPhoneVerificationResponseDto> {
    return this.aptoService.startPhoneVerification(req.user.sub);
  }

  @Post('verification/finish')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  public async finishPhoneVerification(
    @Request() req,
    @Body() body: FinishPhoneVerificationDto,
  ): Promise<CompletePhoneVerificationResponseDto> {
    return this.aptoService.finishPhoneVerification(req.user.sub, body.secret);
  }

  @Post('verification/restart')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  public async restartPhoneVerification(
    @Request() req,
  ): Promise<StartPhoneVerificationResponseDto> {
    return this.aptoService.restartVerification(req.user.sub);
  }

  @Post('user')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  public async createUser(@Request() req): Promise<CreateUserResponseDto> {
    return this.aptoService.createAptoUser(req.user.sub);
  }

  @Post('user/card')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  public async applyForCard(@Request() req): Promise<IssueCardResponseDto> {
    return this.aptoService.issueCard(req.user.sub);
  }
}
