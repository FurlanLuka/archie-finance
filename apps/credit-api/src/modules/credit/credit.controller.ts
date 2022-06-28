import {
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { GetCreditResponseDto } from './credit.dto';
import { CreditService } from './credit.service';
import { AuthGuard } from '@archie-microservices/auth0';

@Controller('v1/credit')
export class CreditController {
  constructor(private creditService: CreditService) {}

  @Post()
  @UseGuards(AuthGuard)
  async createCreditLine(@Request() req): Promise<GetCreditResponseDto> {
    return this.creditService.createCredit(req.user.sub);
  }

  @Get()
  @UseGuards(AuthGuard)
  async getCreditLine(@Request() req): Promise<GetCreditResponseDto> {
    return this.creditService.createCredit(req.user.sub);
  }
}

@Controller('internal/credit')
export class InternalCreditController {
  constructor(private creditService: CreditService) {}

  @Post(':userId')
  async createCreditLine(
    @Param('userId') userId: string,
  ): Promise<GetCreditResponseDto> {
    return this.creditService.createCredit(userId);
  }

  @Get(':userId')
  async getCreditLine(
    @Param('userId') userId: string,
  ): Promise<GetCreditResponseDto> {
    return this.creditService.getCredit(userId);
  }
}
