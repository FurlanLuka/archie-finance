import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { Connection } from 'typeorm';
import { clearDatabase } from '../e2e-test-utils/database.utils';

describe('HealthController (e2e)', () => {
  let app: INestApplication;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();

    await app.init();
  });

  afterAll(async () => {
    await clearDatabase();
    await app.get(Connection).close();
    await module.close();
  });

  it('/health (GET)', async () => {
    await request(app.getHttpServer()).get('/health').expect(200).expect('ok');
  });
});
