import { Injectable } from '@nestjs/common';
import { WebsocketService } from '../websocket/websocket.service';
import { WsEvent } from '../websocket/websocket.interfaces';

@Injectable()
export class EventService {
  constructor(private websocketService: WebsocketService) {}

  public publishToClient(userId: string, event: WsEvent) {
    this.websocketService.publish(userId, event);
  }
}
