import { AppModule } from './app.module';
import './tracer';
import { start } from '@archie/api/utils/microservice';
import { SERVICE_NAME } from '@archie/api/webhook-api/constants';

async function bootstrap() {
  await start(SERVICE_NAME, AppModule);
}

bootstrap();