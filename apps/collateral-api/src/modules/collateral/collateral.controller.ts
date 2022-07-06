import { AuthGuard } from '@archie-microservices/auth0';
import { GetUserWithdrawals } from '@archie-microservices/api-interfaces/collateral';
import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CollateralService } from './collateral.service';
import {
  CollateralDto,
  CollateralValueDto,
  GetTotalCollateralValueResponseDto,
} from './collateral.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('v1/collateral')
export class CollateralController {
  constructor(private collateralService: CollateralService) {}

  @Get()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  async getCollateral(@Req() request): Promise<CollateralDto[]> {
    return this.collateralService.getUserCollateral(request.user.sub);
  }

  @Get('value')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  async getUserCollateralValue(@Req() request): Promise<CollateralValueDto[]> {
    return this.collateralService.getUserCollateralValue(request.user.sub);
  }

  @Get('value/total')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  async getUserTotalCollateralValue(
    @Req() request,
  ): Promise<GetTotalCollateralValueResponseDto> {
    return this.collateralService.getUserTotalCollateralValue(request.user.sub);
  }

  @Post('withdraw')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  async withdrawUserCollateral(
    @Req() request,
    @Body() body: any,
  ): Promise<void> {
    return this.collateralService.withdrawUserCollateral(
      request.user.sub,
      body.asset,
      body.withdrawalAmount,
      body.destinationAddress,
    );
  }

  @Get('withdrawals')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  async getUserWithdrawals(@Req() request): Promise<GetUserWithdrawals> {
    return this.collateralService.getUserWithdrawals(request.user.sub);
  }
}

@Controller('internal/collateral')
export class InternalCollateralController {
  constructor(private collateralService: CollateralService) {}

  @Get(':userId')
  async getCollateral(
    @Param('userId') userId: string,
  ): Promise<CollateralDto[]> {
    return this.collateralService.getUserCollateral(userId);
  }

  @Get('value/:userId')
  async getUserCollateralValue(
    @Param('userId') userId: string,
  ): Promise<CollateralValueDto[]> {
    return this.collateralService.getUserCollateralValue(userId);
  }
}
