import { AuthGuard } from '@archie-microservices/auth0';
import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { CollateralService } from './collateral.service';
import {
  GetUserCollateral,
  GetCollateralValueResponse,
  GetTotalCollateralValueResponse,
} from '@archie-microservices/api-interfaces/collateral';

@Controller('v1/collateral')
export class CollateralController {
  constructor(private collateralService: CollateralService) {}

  @Get()
  @UseGuards(AuthGuard)
  async getCollateral(@Req() request): Promise<GetUserCollateral> {
    return this.collateralService.getUserCollateral(request.user.sub);
  }

  @Get('value')
  @UseGuards(AuthGuard)
  async getUserCollateralValue(
    @Req() request,
  ): Promise<GetCollateralValueResponse> {
    return this.collateralService.getUserCollateralValue(request.user.sub);
  }

  @Get('value/total')
  @UseGuards(AuthGuard)
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
  ): Promise<GetUserCollateral> {
    return this.collateralService.getUserCollateral(userId);
  }

  @Get('value/:userId')
  async getUserCollateralValue(
    @Param('userId') userId: string,
  ): Promise<GetCollateralValueResponse> {
    return this.collateralService.getUserCollateralValue(userId);
  }

}
