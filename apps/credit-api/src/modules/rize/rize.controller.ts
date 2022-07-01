import { AuthGuard } from '@archie-microservices/auth0';
import { Controller, HttpCode, Post, Request, UseGuards } from '@nestjs/common';
import { RizeService } from './rize.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ApiErrorResponse } from '@archie-microservices/openapi';
import {
  CustomerAlreadyExists,
  ActiveCustomerDoesNotExist,
} from './rize.errors';

@Controller('v1/rize')
export class RizeController {
  constructor(private rizeService: RizeService) {}

  @Post('users')
  @UseGuards(AuthGuard)
  @HttpCode(204)
  @ApiBearerAuth()
  @ApiErrorResponse([CustomerAlreadyExists])
  public async createUser(@Request() req): Promise<void> {
    return this.rizeService.createUser(
      req.user.sub,
      req.headers['x-forwarded-for'],
    );
  }

  @Post('users/cards')
  @UseGuards(AuthGuard)
  @HttpCode(204)
  @ApiBearerAuth()
  @ApiErrorResponse([ActiveCustomerDoesNotExist])
  public async createCard(@Request() req): Promise<void> {
    return this.rizeService.createCard(req.user.sub);
  }
}
