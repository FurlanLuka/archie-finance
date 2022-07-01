import { AuthGuard } from '@archie-microservices/auth0';
import { Controller, HttpCode, Post, Request, UseGuards } from '@nestjs/common';
import { RizeService } from './rize.service';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('v1/rize')
export class RizeController {
  constructor(private rizeService: RizeService) {}

  @Post('users')
  @UseGuards(AuthGuard)
  @HttpCode(204)
  @ApiBearerAuth()
  public async createUser(@Request() req): Promise<void> {
    return this.rizeService.createUser(
      req.user.sub,
      req.headers['x-forwarded-for'],
    );
  }
}
