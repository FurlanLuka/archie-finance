import { AppModule } from './app.module';
import './tracer';
import { createMicroservice } from '@archie/api/utils/microservice';
import { Transport } from '@nestjs/microservices';
import { SERVICE_NAME, SERVICE_QUEUE_NAME } from '@archie/api/user/constants';
import 'dotenv/config';

async function bootstrap() {
  await createMicroservice(SERVICE_NAME, AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: [process.env.QUEUE_URL],
      queue: SERVICE_QUEUE_NAME,
      queueOptions: {
        // durable: false
      },
    },
  });
}

bootstrap();
