import { QueueConstants } from '@archie/api/utils/queue';

export const GLOBAL_EXCHANGE_NAME = QueueConstants.GLOBAL_EXCHANGE.name;

export const queueStub = {
  publishEvent: jest.fn(),
  request: jest.fn(),
};
