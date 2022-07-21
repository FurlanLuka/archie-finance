import { AuthGuard } from '@archie/api/utils/auth0';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { KycDto, CreateKycResponseDto, GetKycResponseDto } from './kyc.dto';
import { KycService } from './kyc.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ApiErrorResponse } from '@archie-microservices/openapi';
import { KycAlreadySubmitted, KycNotFoundError } from './kyc.errors';

@Controller('v1/kyc')
export class KycController {
  constructor(private readonly kycService: KycService) {}

  @Get()
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiErrorResponse([KycNotFoundError])
  async getKyc(@Req() request): Promise<GetKycResponseDto> {
    return this.kycService.getKyc(request.user.sub);
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiErrorResponse([KycAlreadySubmitted])
  async createKyc(
    @Body() body: KycDto,
    @Req() request,
  ): Promise<CreateKycResponseDto> {
    return this.kycService.createKyc(body, request.user.sub);
  }
}

@Controller('internal/kyc')
export class InternalKycController {
  constructor(private readonly kycService: KycService) {}

  @Get(':userId')
  @ApiErrorResponse([KycNotFoundError])
  async getKyc(@Param('userId') userId: string): Promise<GetKycResponseDto> {
    return this.kycService.getKyc(userId);
  }
}
