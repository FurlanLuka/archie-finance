import { AuthGuard } from '@archie-microservices/auth0';
import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { CollateralService } from './collateral.service';
import {
  Collateral,
  CollateralValue,
  GetTotalCollateralValueResponse,
} from './collateral.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('v1/collateral')
export class CollateralController {
  constructor(private collateralService: CollateralService) {}

  @Get()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  async getCollateral(@Req() request): Promise<Collateral[]> {
    return this.collateralService.getUserCollateral(request.user.sub);
  }

  @Get('value')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  async getUserCollateralValue(
    @Req() request,
  ): Promise<CollateralValue[]> {
    return this.collateralService.getUserCollateralValue(request.user.sub);
  }

  @Get('value/total')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  async getUserTotalCollateralValue(
    @Req() request,
  ): Promise<GetTotalCollateralValueResponse> {
    return this.collateralService.getUserTotalCollateralValue(request.user.sub);
  }
}

@Controller('internal/collateral')
export class InternalCollateralController {
  constructor(private collateralService: CollateralService) {}

  @Get(':userId')
  async getCollateral(
    @Param('userId') userId: string,
  ): Promise<Collateral[]> {
    return this.collateralService.getUserCollateral(userId);
  }

  @Get('value/:userId')
  async getUserCollateralValue(
    @Param('userId') userId: string,
  ): Promise<CollateralValue[]> {
    return this.collateralService.getUserCollateralValue(userId);
  }

}
