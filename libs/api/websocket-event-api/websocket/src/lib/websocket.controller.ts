import { Controller, Post, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@archie/api/utils/auth0';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthTokenDto } from '@archie/api/websocket-event-api/data-transfer-objects';
import { WebsocketService } from './websocket.service';

@Controller('v1/ws_auth')
export class WebsocketController {
  constructor(private websocketService: WebsocketService) {}

  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  public createAuthToken(@Request() req): Promise<AuthTokenDto> {
    return this.websocketService.createAuthToken(req.user.sub);
  }
}
