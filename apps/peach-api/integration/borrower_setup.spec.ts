import { INestApplication } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';
import {
  cleanUpTestingModule,
  createTestDatabase,
  createTestingModule,
  generateUserAccessToken,
  initializeTestingModule,
  queueStub,
  TestDatabase,
  user,
} from '@archie/test/integration';
import { AppModule } from '../src/app.module';
import { PeachBorrowerQueueController } from '../../../libs/api/peach-api/borrower/src/lib/loan/loan.controller';
import {
  emailVerifiedDataFactory,
  kycSubmittedDataFactory,
} from '@archie/api/user-api/test-data';
import { creditLineCreatedDataFactory } from '@archie/api/credit-limit-api/test-data';
import * as nock from 'nock';
import { ConfigService } from '@archie/api/utils/config';
import { ConfigVariables } from '@archie/api/peach-api/constants';
import {
  CreditLimit,
  CreditLine,
  Draw,
  HomeAddress,
  IdentityType,
  Person,
  PersonStatus,
} from '../../../libs/api/peach-api/borrower/src/lib/api/peach_api.interfaces';
import { when } from 'jest-when';
import { GET_COLLATERAL_VALUE_RPC } from '@archie/api/credit-api/constants';
import { getCollateralValueResponse } from '@archie/api/credit-api/test-data';
import { ExecutionError } from '@archie-microservices/api/utils/redis';

describe('Peach service tests', () => {
  let app: INestApplication;
  let module: TestingModule;
  let config: ConfigService;

  let testDatabase: TestDatabase;
  let accessToken: string;
  let baseNock: nock.Scope;

  const setup = async (): Promise<void> => {
    testDatabase = await createTestDatabase();

    module = await createTestingModule({
      imports: [AppModule],
    }).compile();

    app = await initializeTestingModule(module);

    accessToken = generateUserAccessToken();
    config = app.get(ConfigService);
    baseNock = nock(config.get(ConfigVariables.PEACH_BASE_URL)).matchHeader(
      'X-API-KEY',
      config.get(ConfigVariables.PEACH_API_KEY),
    );
  };

  const cleanup = async (): Promise<void> =>
    cleanUpTestingModule(app, module, testDatabase);

  describe('Create and manage loan', () => {
    beforeAll(setup);
    afterAll(cleanup);
    afterEach(() => {
      nock.cleanAll();
    });

    const person: Person = {
      id: 'personId',
      companyId: 'companyId',
    };
    const homeAddress: HomeAddress = {
      id: 'homeAddressId',
    };
    const creditLine: CreditLine = {
      id: 'creditLineId',
      atOrigination: {
        aprEffective: 16,
        aprNominal: 0,
      },
    };

    it.only('Should store KYC info', async () => {
      const kycSubmittedPayload = kycSubmittedDataFactory();

      console.log(kycSubmittedPayload.dateOfBirth.toISOString());
      baseNock
        .post('/people', {
          externalId: kycSubmittedPayload.userId,
          status: PersonStatus.active,
          name: {
            firstName: kycSubmittedPayload.firstName,
            lastName: kycSubmittedPayload.lastName,
          },
          dateOfBirth: kycSubmittedPayload.dateOfBirth.toISOString(),
          identity: {
            identityType: IdentityType.SSN,
            value: kycSubmittedPayload.ssn,
          },
        })
        .reply(201, {
          data: person,
        });
      baseNock
        .post(`/people/${person.id}/contacts`, {
          contactType: 'phone',
          label: 'personal',
          affiliation: 'self',
          status: 'primary',
          value: `${kycSubmittedPayload.phoneNumberCountryCode}${kycSubmittedPayload.phoneNumber}`,
          valid: true,
          verified: false,
          receiveTextMessages: false,
        })
        .reply(201, {
          data: {},
        });
      baseNock
        .post(`/people/${person.id}/contacts`, {
          contactType: 'address',
          label: 'home',
          affiliation: 'self',
          status: 'primary',
          address: {
            addressLine1: `${kycSubmittedPayload.addressStreetNumber} ${kycSubmittedPayload.addressStreet}`,
            city: kycSubmittedPayload.addressLocality,
            state: kycSubmittedPayload.addressRegion,
            postalCode: kycSubmittedPayload.addressPostalCode,
            country: kycSubmittedPayload.addressCountry,
          },
        })
        .reply(201, { data: homeAddress });

      await app
        .get(PeachBorrowerQueueController)
        .kycSubmittedHandler(kycSubmittedPayload);

      expect(nock.isDone()).toEqual(true);
    });

    it.only('Should store Email', async () => {
      const emailVerifiedPayload = emailVerifiedDataFactory();
      baseNock
        .post(`/people/${person.id}/contacts`, {
          contactType: 'email',
          label: 'personal',
          affiliation: 'self',
          status: 'primary',
          value: emailVerifiedPayload.email,
          valid: true,
          verified: true,
        })
        .reply(201, { data: {} });

      await app
        .get(PeachBorrowerQueueController)
        .emailVerifiedHandler(emailVerifiedPayload);

      expect(nock.isDone()).toEqual(true);
    });

    it.only('Should create active user and active loan', async () => {
      const emailVerifiedPayload = emailVerifiedDataFactory();
      const creditLineCreatedPayload = creditLineCreatedDataFactory();
      baseNock
        .post(
          `/companies/${config.get(ConfigVariables.PEACH_COMPANY_ID)}/users`,
          {
            userType: 'borrower',
            authType: {
              email: emailVerifiedPayload.email,
            },
            roles: [config.get(ConfigVariables.PEACH_BORROWER_ROLE_ID)],
            associatedPersonId: person.id,
          },
        )
        .reply(201, { data: {} });
      const collateralValue = getCollateralValueResponse();
      when(queueStub.request)
        .calledWith(GET_COLLATERAL_VALUE_RPC, {
          userId: user.id,
        })
        .mockReturnValue(collateralValue);
      baseNock
        .post(`/people/${person.id}/loans`, {
          loanTypeId: config.get(ConfigVariables.PEACH_LOAN_ID),
          type: 'lineOfCredit',
          servicedBy: 'creditor',
          status: 'originated',
          newDrawsAllowed: true,
          atOrigination: {
            interestRates: [{ days: null, rate: 0 }],
            paymentFrequency: 'monthly',
            originationLicense: 'nationalBank',
            originatingCreditorName: 'Bank of Mars',
            aprNominal: 0,
            aprEffective: 0.16,
            creditLimitAmount: creditLineCreatedPayload.amount,
            downPaymentAmount: collateralValue[0].price,
            personAddressId: homeAddress.id,
          },
        })
        .reply(201, { data: creditLine });
      baseNock
        .post(`/people/${person.id}/loans/${creditLine.id}/activate`, {})
        .reply(201, { data: {} });

      const draw: Draw = {
        id: 'drawId',
      };
      baseNock
        .post(`/people/${person.id}/loans/${creditLine.id}/draws`, {
          nickname: 'Credit Card',
          status: 'originated',
          atOrigination: {
            minPaymentCalculation: {
              percentageOfPrincipal: 0.1,
              minAmount: 0,
            },
          },
        })
        .reply(201, { data: draw });
      baseNock
        .post(
          `/people/${person.id}/loans/${creditLine.id}/draws/${draw.id}/activate`,
        )
        .reply(201, { data: {} });

      await app
        .get(PeachBorrowerQueueController)
        .creditLineCreatedHandler(creditLineCreatedPayload);

      expect(nock.isDone()).toEqual(true);
    });

    describe('Credit limit updates', () => {
      const updatedCreditLimit: CreditLimit = {
        creditLimitAmount: 100,
      };
      const dateBeforeUpdate = new Date().toISOString();

      // TODO: shouldn't update second time if date is lower, locks
      it.only('Should update credit limit', async () => {
        const balances = {
          isLocked: false,
          availableCreditAmount: 100,
          creditLimitAmount: 100,
          calculatedAt: new Date().toISOString(),
        };
        baseNock
          .post(`/people/${person.id}/loans/${creditLine.id}/credit-limit`, {
            creditLimitAmount: updatedCreditLimit.creditLimitAmount,
          })
          .reply(201, { data: updatedCreditLimit });
        baseNock
          .get(`/people/${person.id}/loans/${creditLine.id}/balances`)
          .reply(201, { data: balances });

        await app.get(PeachBorrowerQueueController).creditLimitUpdatedHandler({
          userId: user.id,
          creditLimit: updatedCreditLimit.creditLimitAmount,
          calculatedAt: new Date().toISOString(),
        });

        expect(nock.isDone()).toEqual(true);
      });

      it.only('Should not update the credit limit if calculated at is before the handled one', async () => {
        const balances = {
          isLocked: false,
          availableCreditAmount: 100,
          creditLimitAmount: 100,
          calculatedAt: new Date().toISOString(),
        };
        const creditLimitUpdate = baseNock
          .post(`/people/${person.id}/loans/${creditLine.id}/credit-limit`, {
            creditLimitAmount: updatedCreditLimit.creditLimitAmount + 1,
          })
          .reply(201, { data: updatedCreditLimit });
        baseNock
          .get(`/people/${person.id}/loans/${creditLine.id}/balances`)
          .reply(201, { data: balances });

        await app.get(PeachBorrowerQueueController).creditLimitUpdatedHandler({
          userId: user.id,
          creditLimit: updatedCreditLimit.creditLimitAmount + 1,
          calculatedAt: dateBeforeUpdate,
        });

        expect(creditLimitUpdate.isDone()).toEqual(false);
      });

      it.only('Should reject credit limit update in case the lock is already taken ', async () => {
        const balances = {
          isLocked: false,
          availableCreditAmount: 100,
          creditLimitAmount: 100,
          calculatedAt: new Date().toISOString(),
        };
        const failedCreditLimitUpdate = 20;
        baseNock
          .post(`/people/${person.id}/loans/${creditLine.id}/credit-limit`, {
            creditLimitAmount: updatedCreditLimit.creditLimitAmount,
          })
          .delay(500)
          .reply(201, { data: updatedCreditLimit });
        baseNock
          .get(`/people/${person.id}/loans/${creditLine.id}/balances`)
          .reply(201, { data: balances });

        await expect(
          Promise.allSettled([
            app.get(PeachBorrowerQueueController).creditLimitUpdatedHandler({
              userId: user.id,
              creditLimit: updatedCreditLimit.creditLimitAmount,
              calculatedAt: new Date().toISOString(),
            }),
            app.get(PeachBorrowerQueueController).creditLimitUpdatedHandler({
              userId: user.id,
              creditLimit: failedCreditLimitUpdate,
              calculatedAt: new Date().toISOString(),
            }),
          ]),
        ).resolves.toStrictEqual([
          { status: 'fulfilled', value: undefined },
          { reason: expect.any(ExecutionError), status: 'rejected' },
        ]);

        expect(nock.isDone()).toEqual(true);
      });
    });
  });
});
