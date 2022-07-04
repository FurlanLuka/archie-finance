import { AuthGuard } from '@archie-microservices/auth0';
import {
  Controller,
  Get,
  HttpCode,
  Post,
  Request,
  UseGuards,
  Response,
} from '@nestjs/common';
import { RizeService } from './rize.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ApiErrorResponse } from '@archie-microservices/openapi';
import {
  CustomerAlreadyExists,
  ActiveCustomerDoesNotExist,
  DebitCardAlreadyExists,
  DebitCardDoesNotExist,
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
      req.headers['x-forwarded-for'] ?? '123.56.3.12', //TODO: remove optional,
    );
  }

  @Post('users/cards')
  @UseGuards(AuthGuard)
  @HttpCode(204)
  @ApiBearerAuth()
  @ApiErrorResponse([ActiveCustomerDoesNotExist, DebitCardAlreadyExists])
  public async createCard(@Request() req): Promise<void> {
    return this.rizeService.createCard(req.user.sub);
  }

  @Get('users/cards/virtual')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiErrorResponse([DebitCardDoesNotExist])
  public async getVirtualCard(@Request() req, @Response() res): Promise<void> {
    const virtualCard: string = await this.rizeService.getVirtualCard(
      req.user.sub,
    );

    res.writeHead(200, { 'Content-Type': 'image/png' });
    res.sendFi(Buffer.from(virtualCard, 'base64'));
  }
}
