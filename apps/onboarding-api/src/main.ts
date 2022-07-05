import { AppModule } from './app.module';
import './tracer';
import { createMicroservice } from '@archie/api/utils/microservice';
import {
  SERVICE_NAME,
  SERVICE_QUEUE_NAME,
} from '@archie/api/onboarding-api/constants';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  await createMicroservice(SERVICE_NAME, AppModule, {
    transport: Transport.RMQ,
    options: {
      queue: SERVICE_QUEUE_NAME,
      urls: [process.env.QUEUE_URL],
      queueOptions: {
        durable: true,
      },
    },
  });
}

bootstrap();
