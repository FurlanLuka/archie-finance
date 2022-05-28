import { Provider } from '@nestjs/common';
import { getConnectionToken } from '@nestjs/typeorm';

// eslint-disable-next-line
export const getMockConnectionProvider = (): Provider<any> => {
  return {
    provide: getConnectionToken(),
    useValue: {
      createQueryRunner: jest.fn(),
    },
  };
};

export const getMockQueryRunner = () => ({
  connect: jest.fn(),
  startTransaction: jest.fn(),
  commitTransaction: jest.fn(),
  rollbackTransaction: jest.fn(),
  release: jest.fn(),
  manager: {
    update: jest.fn(),
    save: jest.fn(),
  },
});
