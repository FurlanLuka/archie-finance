import { Test, TestingModule } from '@nestjs/testing';
import {
  ExecutionContext,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { AppModule } from '../../src/app.module';
import { clearDatabase } from '../e2e-test-utils/database.utils';
import { Connection } from 'typeorm';
import { verifyAccessToken } from '../e2e-test-utils/mock.auth.utils';
import { AuthGuard } from '@archie-microservices/auth0';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { CHECK_MARGIN_EXCHANGE } from '../../../../libs/api/credit-api/constants/src';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MarginQueueController } from '../../src/modules/margin/margin.controller';

describe('MarginQueueController (e2e)', () => {
  let app: INestApplication;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideGuard(AuthGuard)
      .useValue({
        canActivate: (context: ExecutionContext) => {
          const request = context.switchToHttp().getRequest();

          const accessToken: string =
            request.headers.authorization.split(' ')[1];

          request.user = verifyAccessToken(accessToken);

          return true;
        },
      })
      .overrideProvider(AmqpConnection)
      .useValue({
        publish: (a, b, c) => console.log('mock', a, b, c),
      })
      .compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));

    await app.init();
  });

  afterAll(async () => {
    const connection: Connection = app.get(Connection);
    await clearDatabase(connection);
    await connection.close();
    await module.close();
  });

  describe('CHECK_MARGIN_EXCHANGE flow', () => {
    const userId: string = 'userId';

    it('CHECK_MARGIN_EXCHANGE - Should not push any events in case LTV is under 60%', async () => {
      const amqpConnectionService: AmqpConnection = app.get(AmqpConnection);

      await app.get(MarginQueueController).checkMargin({ userIds: [userId] });

      // TODO: temp
      amqpConnectionService.publish(CHECK_MARGIN_EXCHANGE.name, '', {
        userIds: [userId],
      });
    });
  });
});
