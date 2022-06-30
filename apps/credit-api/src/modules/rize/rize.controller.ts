import { Controller, HttpCode, Ip, Post, Request } from '@nestjs/common';
import { RizeService } from './rize.service';

@Controller('v1/rize')
export class RizeController {
  constructor(private rizeService: RizeService) {}

  @Post('users')
  // @UseGuards(AuthGuard)
  @HttpCode(204)
  // @ApiBearerAuth()
  public async createUser(@Request() req, @Ip() ip): Promise<void> {
    const userId = 'test239';
    return this.rizeService.createUser(userId, req.connection.remoteAddress);
  }
}
