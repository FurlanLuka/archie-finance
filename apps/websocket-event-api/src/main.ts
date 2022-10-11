import { AppModule } from './app.module';
import './tracer';
import { start } from '@archie/api/utils/microservice';
import { SERVICE_NAME } from '@archie/api/websocket-event-api/constants';
import { Logger } from '@nestjs/common';
import { WsAdapter } from '@archie/api/websocket-event-api/websocket-event';

async function bootstrap(): Promise<void> {
  const app = await start(SERVICE_NAME, AppModule);
  app?.useWebSocketAdapter(new WsAdapter(app));
}

bootstrap().catch((error) => {
  Logger.error(error);
  throw error;
});
