import { INestApplication } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';
import {
  cleanUpTestingModule,
  createTestDatabase,
  createTestingModule,
  initializeTestingModule,
  queueStub,
  TestDatabase,
  user,
} from '@archie/test/integration';
import { AppModule } from '../src/app.module';
import {
  Balances,
  PeachBorrowerQueueController,
} from '@archie/api/peach-api/borrower';
import {
  emailVerifiedDataFactory,
  kycSubmittedDataFactory,
} from '@archie/api/user-api/test-data';
import {
  creditLineUpdatedDataFactory,
  creditLineCreatedDataFactory,
} from '@archie/api/credit-line-api/test-data';
import * as nock from 'nock';
import { ConfigService } from '@archie/api/utils/config';
import {
  ConfigVariables,
  CREDIT_BALANCE_UPDATED_TOPIC,
} from '@archie/api/peach-api/constants';
import {
  CreditLimit,
  CreditLine,
  Draw,
  HomeAddress,
  Person,
  BorrowerMailNotFoundError,
  BorrowerNotFoundError,
  CreditLineNotFoundError,
} from '@archie/api/peach-api/borrower';
import {
  homeAddressContactRequestBodyFactory,
  creditLineFactory,
  homeAddressContactFactory,
  personFactory,
  personRequestBodyFactory,
  phoneContactRequestBodyFactory,
  emailContactRequestBodyFactory,
  userRequestBodyFactory,
  loanRequestBodyFactory,
  drawFactory,
  drawRequestBodyFactory,
  creditLimitFactory,
  balancesFactory,
  creditLimitUpdateRequestBodyFactory,
  PeachNock,
} from '@archie-microservices/api/peach-api/test-data';
import { LockedResourceError } from '@archie-microservices/api/utils/redis';
import { DateTime } from 'luxon';

describe('Peach service tests', () => {
  let app: INestApplication;
  let module: TestingModule;
  let config: ConfigService;

  let testDatabase: TestDatabase;
  let peachNock: PeachNock;

  const setup = async (): Promise<void> => {
    testDatabase = await createTestDatabase();

    module = await createTestingModule({
      imports: [AppModule],
    }).compile();

    app = await initializeTestingModule(module);

    config = app.get(ConfigService);
    peachNock = new PeachNock(
      config.get(ConfigVariables.PEACH_BASE_URL),
      config.get(ConfigVariables.PEACH_API_KEY),
    );
  };

  const cleanup = async (): Promise<void> =>
    cleanUpTestingModule(app, module, testDatabase);

  describe('Borrower is not created yet', () => {
    beforeAll(setup);
    afterAll(cleanup);
    afterEach(() => {
      peachNock.cleanAll();
    });

    it('Should throw borrower not found and retry email verified event', async () => {
      const emailVerifiedPayload = emailVerifiedDataFactory();

      await expect(
        app
          .get(PeachBorrowerQueueController)
          .emailVerifiedHandler(emailVerifiedPayload),
      ).rejects.toBeInstanceOf(BorrowerNotFoundError);
    });

    it('Should throw borrower not found and retry credit line created event', async () => {
      const creditLineCreatedPayload = creditLineCreatedDataFactory();

      await expect(
        app
          .get(PeachBorrowerQueueController)
          .creditLineCreatedHandler(creditLineCreatedPayload),
      ).rejects.toBeInstanceOf(BorrowerNotFoundError);
    });

    it('Should throw borrower not found and retry credit limit updated event', async () => {
      const creditLimitUpdatedPayload = creditLimitUpdatedDataFactory();

      await expect(
        app
          .get(PeachBorrowerQueueController)
          .creditLimitUpdatedHandler(creditLimitUpdatedPayload),
      ).rejects.toBeInstanceOf(BorrowerNotFoundError);
    });
  });

  describe('Create and manage loan', () => {
    beforeAll(setup);
    afterAll(cleanup);
    afterEach(() => {
      peachNock.cleanAll();
    });

    const person: Person = personFactory();
    const homeAddress: HomeAddress = homeAddressContactFactory();
    const creditLine: CreditLine = creditLineFactory();

    describe('Kyc submitted event handling', () => {
      const kycSubmittedPayload = kycSubmittedDataFactory();
      let createPhoneContactNock: nock.Interceptor;
      let createPersonNock: nock.Interceptor;

      beforeEach(() => {
        createPersonNock = peachNock.setupCreatePersonNock(
          personRequestBodyFactory(kycSubmittedPayload),
          person,
        );
        createPhoneContactNock = peachNock.setupCreateContactNock(
          person.id,
          phoneContactRequestBodyFactory(kycSubmittedPayload),
        );
        peachNock.setupCreateContactNock(
          person.id,
          homeAddressContactRequestBodyFactory(kycSubmittedPayload),
          homeAddress,
        );
      });

      it('Should create person and add phone and home address contact', async () => {
        await app
          .get(PeachBorrowerQueueController)
          .kycSubmittedHandler(kycSubmittedPayload);

        expect(peachNock.areAllDone()).toEqual(true);
      });

      it('Should not rethrow in case phone contact was already added and keep the same person entity', async () => {
        createPhoneContactNock.reply(400);

        await expect(
          app
            .get(PeachBorrowerQueueController)
            .kycSubmittedHandler(kycSubmittedPayload),
        ).resolves.not.toThrow();

        expect(peachNock.isDone(createPersonNock)).toEqual(false);
      });
    });

    describe('Borrower mail is not defined', () => {
      it('Should throw mail not found error on the credit line created handler and retry', async () => {
        const creditLineCreatedPayload = creditLineCreatedDataFactory();

        await expect(
          app
            .get(PeachBorrowerQueueController)
            .creditLineCreatedHandler(creditLineCreatedPayload),
        ).rejects.toBeInstanceOf(BorrowerMailNotFoundError);
      });
    });

    describe('Email verified event handling', () => {
      it('Should add email contact', async () => {
        const emailVerifiedPayload = emailVerifiedDataFactory();
        peachNock.setupCreateContactNock(
          person.id,
          emailContactRequestBodyFactory(emailVerifiedPayload),
        );

        await app
          .get(PeachBorrowerQueueController)
          .emailVerifiedHandler(emailVerifiedPayload);

        expect(peachNock.areAllDone()).toEqual(true);
      });
    });

    describe('Credit line is not defined', () => {
      it('Should throw credit line not found error on the credit limit updated handler and retry', async () => {
        const creditLimitUpdatedPayload = creditLimitUpdatedDataFactory();

        await expect(
          app
            .get(PeachBorrowerQueueController)
            .creditLimitUpdatedHandler(creditLimitUpdatedPayload),
        ).rejects.toBeInstanceOf(CreditLineNotFoundError);
      });
    });

    describe('Credit line created event handling', () => {
      const emailVerifiedPayload = emailVerifiedDataFactory();
      const creditLineCreatedPayload = creditLineCreatedDataFactory();
      const draw: Draw = drawFactory();
      let createUserNock: nock.Interceptor;
      let createLoanNock: nock.Interceptor;
      let activateLoanNock: nock.Interceptor;
      let activateDrawNock: nock.Interceptor;
      let createDrawNock: nock.Interceptor;

      beforeEach(() => {
        createUserNock = peachNock.setupCreateUserNock(
          config.get(ConfigVariables.PEACH_COMPANY_ID),
          userRequestBodyFactory(
            emailVerifiedPayload.email,
            config.get(ConfigVariables.PEACH_BORROWER_ROLE_ID),
            person.id,
          ),
        );
        createLoanNock = peachNock.setupCreateLoanNock(
          person.id,
          loanRequestBodyFactory(
            config.get(ConfigVariables.PEACH_LOAN_ID),
            creditLineCreatedPayload,
            homeAddress.id,
          ),
          creditLine,
        );
        activateLoanNock = peachNock.setupActivateLoanNock(
          person.id,
          creditLine.id,
          {},
        );
        createDrawNock = peachNock.setupCreateDrawNock(
          person.id,
          creditLine.id,
          drawRequestBodyFactory(),
          draw,
        );
        activateDrawNock = peachNock.setupActivateDrawNock(
          person.id,
          creditLine.id,
          draw.id,
        );
      });

      it('Should create user and active loan', async () => {
        await app
          .get(PeachBorrowerQueueController)
          .creditLineCreatedHandler(creditLineCreatedPayload);

        expect(peachNock.areAllDone()).toEqual(true);
      });

      it('Should handle retried event without creating a new loan or draw', async () => {
        peachNock.clearInterceptor(createUserNock);
        createUserNock.reply(409);
        activateDrawNock.reply(400);
        activateLoanNock.reply(400);

        await app
          .get(PeachBorrowerQueueController)
          .creditLineCreatedHandler(creditLineCreatedPayload);

        expect(peachNock.isDone(createLoanNock)).toEqual(false);
        expect(peachNock.isDone(createDrawNock)).toEqual(false);
      });
    });
    describe('Credit limit updates', () => {
      const creditLimit: CreditLimit = creditLimitFactory();
      const balances: Balances = balancesFactory();
      let firstCreditLineUpdatedPayload;

      beforeAll(() => {
        firstCreditLineUpdatedPayload = creditLineUpdatedDataFactory();
      });

      it('Should update the credit limit', async () => {
        peachNock.setupUpdateCreditLimitNock(
          person.id,
          creditLine.id,
          creditLimitUpdateRequestBodyFactory(
            firstCreditLineUpdatedPayload.creditLimit,
          ),
          creditLimit,
        );
        peachNock.setupGetBalancesNock(person.id, creditLine.id, balances);

        await app
          .get(PeachBorrowerQueueController)
          .creditLineUpdatedHandler(firstCreditLineUpdatedPayload);

        expect(peachNock.areAllDone()).toEqual(true);
        expect(queueStub.publish).toHaveBeenCalledWith(
          CREDIT_BALANCE_UPDATED_TOPIC,
          {
            userId: user.id,
            availableCreditAmount: balances.availableCreditAmount,
            calculatedAt: balances.calculatedAt,
            creditLimitAmount: balances.creditLimitAmount,
            utilizationAmount: balances.utilizationAmount,
          },
        );
      });

      it('Should not update the credit limit if It was calculated before already handled event', async () => {
        const creditLimitUpdateRequest = peachNock.setupUpdateCreditLimitNock(
          person.id,
          creditLine.id,
          creditLimitUpdateRequestBodyFactory(creditLimit.creditLimitAmount),
          creditLimit,
        );
        peachNock.setupGetBalancesNock(person.id, creditLine.id, balances);

        await app.get(PeachBorrowerQueueController).creditLineUpdatedHandler(
          creditLineUpdatedDataFactory({
            ...firstCreditLineUpdatedPayload,
            calculatedAt: DateTime.local().minus({ minutes: 1 }).toISO(),
          }),
        );

        expect(peachNock.isDone(creditLimitUpdateRequest)).toEqual(false);
      });

      it('Should throw error in case the lock for credit limit update is already taken', async () => {
        peachNock.setupUpdateCreditLimitNock(
          person.id,
          creditLine.id,
          creditLimitUpdateRequestBodyFactory(creditLimit.creditLimitAmount),
          creditLimit,
          201,
          50,
        );
        peachNock.setupGetBalancesNock(person.id, creditLine.id, balances);

        await expect(
          Promise.allSettled([
            app
              .get(PeachBorrowerQueueController)
              .creditLineUpdatedHandler(creditLineUpdatedDataFactory()),
            app.get(PeachBorrowerQueueController).creditLineUpdatedHandler(
              creditLineUpdatedDataFactory({
                creditLimit: 20,
              }),
            ),
          ]),
        ).resolves.toStrictEqual([
          { status: 'fulfilled', value: undefined },
          { reason: expect.any(LockedResourceError), status: 'rejected' },
        ]);

        expect(peachNock.areAllDone()).toEqual(true);
      });
    });
  });
});
