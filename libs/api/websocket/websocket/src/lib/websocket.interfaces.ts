import { Client } from '@nestjs/microservices/external/nats-client.interface';

export interface ActiveClient {
  userId: string;
  client: Client;
}
