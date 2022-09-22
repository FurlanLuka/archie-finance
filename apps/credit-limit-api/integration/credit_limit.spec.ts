import { INestApplication } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';
import {
  TestDatabase,
  createTestDatabase,
  createTestingModule,
  initializeTestingModule,
  generateUserAccessToken,
  cleanUpTestingModule,
  queueStub,
} from '@archie/test/integration';
import { AppModule } from '../src/app.module';
import { when } from 'jest-when';
import { GET_ASSET_PRICES_RPC } from '@archie/api/asset-price-api/constants';
import { getAssetPricesResponseDataFactory } from '@archie/api/asset-price-api/test-data';
import { GetAssetPriceResponse } from '@archie/api/asset-price-api/data-transfer-objects';
import { GET_ASSET_INFORMATION_RPC } from '@archie/api/collateral-api/constants';
import { assetListResponseData } from '@archie/api/collateral-api/test-data';

describe('Credit limit service tests', () => {
  let app: INestApplication;
  let module: TestingModule;
  let testDatabase: TestDatabase;
  let accessToken: string;

  const getAssetPricesResponseData: GetAssetPriceResponse[] =
    getAssetPricesResponseDataFactory();

  const setup = async (): Promise<void> => {
    testDatabase = await createTestDatabase();

    module = await createTestingModule({
      imports: [AppModule],
    }).compile();

    app = await initializeTestingModule(module);

    accessToken = generateUserAccessToken();

    // Mock RPC request to return array of asset prices
    when(queueStub.request)
      .calledWith(GET_ASSET_PRICES_RPC)
      .mockResolvedValue(getAssetPricesResponseData);
    // Mock RPC request to return the asset list
    when(queueStub.request)
      .calledWith(GET_ASSET_INFORMATION_RPC)
      .mockResolvedValue(assetListResponseData);
  };

  const cleanup = async (): Promise<void> =>
    cleanUpTestingModule(app, module, testDatabase);

  describe('Create credit line', () => {
    beforeAll(setup);
    afterAll(cleanup);
  });
});
