import { Injectable } from '@nestjs/common';
import { WebsocketService } from '../websocket/websocket.service';
import { WsEvent } from '../websocket/websocket.interfaces';

@Injectable()
export class EventService {
  constructor(private websocketService: WebsocketService) {}

  public publishToClient(userId: string, event: WsEvent): void {
    this.websocketService.publish(userId, event);
  }
}
