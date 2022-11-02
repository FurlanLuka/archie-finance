import { QueueUtilService } from '@archie/api/utils/queue';

export const GLOBAL_EXCHANGE_NAME = QueueUtilService.GLOBAL_EXCHANGE.name;

export const queueStub = {
  publishEvent: jest.fn(),
  request: jest.fn(),
};
