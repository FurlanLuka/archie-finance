import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from '@nestjs/microservices';
import { NestGateway } from '@nestjs/websockets/interfaces/nest-gateway.interface';
import { Client } from '@nestjs/microservices/external/nats-client.interface';

@WebSocketGateway({
  transports: ['websocket'],
})
export class WebsocketServer implements NestGateway {
  @WebSocketServer()
  server: Server;

  afterInit(server: Server) {
    console.log(server);
  }
  handleDisconnect(client: Client) {
    console.log('client disconnect', client);
  }

  handleConnection(client: any, ...args: any[]) {
    console.log('client connect', client.id, client.user);
  }
}
