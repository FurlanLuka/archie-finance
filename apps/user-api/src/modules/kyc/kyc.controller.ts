import { AuthGuard } from '@archie-microservices/auth0';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { KycDto, CreateKycResponse, GetKycResponse } from './kyc.dto';
import { KycService } from './kyc.service';

@Controller('v1/kyc')
export class KycController {
  constructor(private readonly kycService: KycService) {}

  @Get()
  @UseGuards(AuthGuard)
  async getKyc(@Req() request): Promise<GetKycResponse> {
    return this.kycService.getKyc(request.user.sub);
  }

  @Post()
  @UseGuards(AuthGuard)
  async createKyc(
    @Body() body: KycDto,
    @Req() request,
  ): Promise<CreateKycResponse> {
    return this.kycService.createKyc(body, request.user.sub);
  }
}

@Controller('internal/kyc')
export class InternalKycController {
  constructor(private readonly kycService: KycService) {}

  @Get(':userId')
  async getKyc(@Param('userId') userId: string): Promise<GetKycResponse> {
    return this.kycService.getKyc(userId);
  }
}
