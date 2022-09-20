import { INestApplication } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';
import {
  cleanUpTestingModule,
  createTestDatabase,
  createTestingModule,
  generateUserAccessToken,
  initializeTestingModule,
  TestDatabase,
} from '@archie/test/integration';
import { AppModule } from '../src/app.module';
import * as request from 'supertest';

jest.setTimeout(30000);

describe('Onboarding service tests', () => {
  let app: INestApplication;
  let module: TestingModule;
  let testDatabase: TestDatabase;
  let accessToken: string;

  beforeEach(async () => {
    testDatabase = await createTestDatabase();

    module = await createTestingModule({
      imports: [AppModule],
    }).compile();

    app = await initializeTestingModule(module);

    accessToken = generateUserAccessToken();
  });

  afterEach(async () => cleanUpTestingModule(app, module, testDatabase));

  describe('Create and update onboarding record for user', () => {
    it('should return empty onboarding record', async () => {
      const response = await request(app.getHttpServer())
        .get('/v1/onboarding')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body).toBe({
        
      })
    });
  });
});
