import { QueueUtilService } from '@archie/api/utils/queue';

export const GLOBAL_EXCHANGE_NAME = QueueUtilService.GLOBAL_EXCHANGE.name;

export const amqpStub = {
  publish: jest.fn(),
  createSubscriber: jest.fn(),
};
