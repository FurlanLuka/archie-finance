import { Module } from '@nestjs/common';
import { WebsocketController } from './websocket.controller';
import { WebsocketService } from './websocket.service';
import { WebsocketServer } from './websocket.server';

@Module({
  imports: [],
  providers: [WebsocketService, WebsocketServer],
  controllers: [WebsocketController],
})
export class WebsocketModule {}
