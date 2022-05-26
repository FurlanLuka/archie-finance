import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { when } from 'jest-when';
import { user } from '../../../test/test-data/user.data';
import { Auth0Service } from '../auth0/auth0.service';
import { Auth0ServiceMock } from '../auth0/__mocks__/auth0.service.mock';
import { UserService } from './user.service';
import { getUserData } from './__data__/user.service.data';

describe('UserService', () => {
  let service: UserService;

  let auth0Service: Auth0ServiceMock;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: Auth0Service,
          useClass: Auth0ServiceMock,
        },
      ],
    }).compile();

    service = module.get(UserService);
    auth0Service = module.get(Auth0Service);
  });

  describe('#isEmailVerified', () => {
    it('should return false because email is not verified', async () => {
      when(auth0Service.getUser)
        .calledWith({
          id: user.id,
        })
        .mockResolvedValue(getUserData());

      await expect(service.isEmailVerified(user.id)).resolves.toStrictEqual({
        isVerified: false,
      });
    });

    it('should return true', async () => {
      when(auth0Service.getUser)
        .calledWith({
          id: user.id,
        })
        .mockResolvedValue(getUserData(true));

      await expect(service.isEmailVerified(user.id)).resolves.toStrictEqual({
        isVerified: true,
      });
    });
  });

  describe('#resendEmailVerification', () => {
    it('should trigger email resend', async () => {
      when(auth0Service.getUser)
        .calledWith({
          id: user.id,
        })
        .mockResolvedValue(getUserData());

      await service.resendEmailVerification(user.id);

      expect(auth0Service.sendEmailVerification).toHaveBeenCalledWith({
        user_id: user.id,
      });
    });

    it('should throw bad request exception because email is already verified', async () => {
      when(auth0Service.getUser)
        .calledWith({
          id: user.id,
        })
        .mockResolvedValue(getUserData(true));

      await expect(
        service.resendEmailVerification(user.id),
      ).rejects.toThrowError(BadRequestException);
    });
  });
});
