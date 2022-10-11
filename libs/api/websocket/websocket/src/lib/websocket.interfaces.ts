import { Client } from '@nestjs/microservices/external/nats-client.interface';

export interface ActiveClient {
  userId: string;
  client: Client;
}

export interface WsEvent {
  subject: string;
  data: unknown;
}
