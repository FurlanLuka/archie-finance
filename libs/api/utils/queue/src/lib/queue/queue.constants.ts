import { Injectable } from '@nestjs/common';

@Injectable()
export class QueueConstants {
  public static GLOBAL_EXCHANGE = {
    name: 'archie.microservice.tx',
    type: 'topic',
  };
}
