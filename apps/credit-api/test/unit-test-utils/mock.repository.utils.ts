import { Provider } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';

export const getMockRepositoryProvider = (
  entity: EntityClassOrSchema,
  // eslint-disable-next-line
): Provider<any> => {
  return {
    provide: getRepositoryToken(entity),
    useValue: {
      save: jest.fn(),
      update: jest.fn(),
      findOneBy: jest.fn(),
      findOneByOrFail: jest.fn(),
    },
  };
};
