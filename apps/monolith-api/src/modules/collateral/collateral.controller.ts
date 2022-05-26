import { AuthGuard } from '@archie-microservices/auth0';
import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Collateral } from './collateral.entity';
import { CollateralService } from './collateral.service';

@Controller('v1/collateral')
export class CollateralController {
  constructor(private collateralService: CollateralService) {}

  @Get()
  @UseGuards(AuthGuard)
  async getCollateral(@Req() request): Promise<Collateral[]> {
    return this.collateralService.getUserCollateral(request.user.sub);
  }
}
