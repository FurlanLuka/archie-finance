import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthDto } from '@archie/tests/utils-api/data-transfer-objects';
import { AuthService } from './auth.service';

@Controller('internal/test/authorization')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post()
  createToken(@Body() payload: AuthDto): string {
    return this.authService.createToken(payload.userId);
  }

  @Get('.well-known/jwks.json')
  getPublicKey(): object {
    return this.authService.getPublicKey();
  }
}
