import { INestApplication } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';
import {
  cleanUpTestingModule,
  createTestDatabase,
  createTestingModule,
  initializeTestingModule,
  TestDatabase,
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
  creditLimitUpdatedDataFactory,
  creditLineCreatedDataFactory,
} from '@archie/api/credit-limit-api/test-data';
import * as nock from 'nock';
import { ConfigService } from '@archie/api/utils/config';
import { ConfigVariables } from '@archie/api/peach-api/constants';
import {
  CreditLimit,
  CreditLine,
  Draw,
  HomeAddress,
  Person,
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
  setupBaseNock,
  setupCreatePersonNock,
  setupCreateContactNock,
  setupCreateUserNock,
  setupCreateLoanNock,
  setupActivateLoanNock,
  setupCreateDrawNock,
  setupActivateDrawNock,
  setupUpdateCreditLimitNock,
  setupGetBalancesNock,
} from '@archie-microservices/api/peach-api/test-data';
import { LockedResourceError } from '@archie-microservices/api/utils/redis';

describe('Peach service tests', () => {
  let app: INestApplication;
  let module: TestingModule;
  let config: ConfigService;

  let testDatabase: TestDatabase;

  const setup = async (): Promise<void> => {
    testDatabase = await createTestDatabase();

    module = await createTestingModule({
      imports: [AppModule],
    }).compile();

    app = await initializeTestingModule(module);

    config = app.get(ConfigService);
    setupBaseNock(
      config.get(ConfigVariables.PEACH_BASE_URL),
      config.get(ConfigVariables.PEACH_API_KEY),
    );
  };

  const cleanup = async (): Promise<void> =>
    cleanUpTestingModule(app, module, testDatabase);

  describe('Create and manage loan', () => {
    beforeAll(setup);
    afterAll(cleanup);
    afterEach(nock.cleanAll);

    const person: Person = personFactory();
    const homeAddress: HomeAddress = homeAddressContactFactory();
    const creditLine: CreditLine = creditLineFactory();

    it('Should create person and add phone and home address contact', async () => {
      const kycSubmittedPayload = kycSubmittedDataFactory();
      setupCreatePersonNock(
        personRequestBodyFactory(kycSubmittedPayload),
        person,
      );
      setupCreateContactNock(
        person.id,
        phoneContactRequestBodyFactory(kycSubmittedPayload),
      );
      setupCreateContactNock(
        person.id,
        homeAddressContactRequestBodyFactory(kycSubmittedPayload),
        homeAddress,
      );

      await app
        .get(PeachBorrowerQueueController)
        .kycSubmittedHandler(kycSubmittedPayload);

      expect(nock.isDone()).toEqual(true);
    });

    it('Should add email contact', async () => {
      const emailVerifiedPayload = emailVerifiedDataFactory();
      setupCreateContactNock(
        person.id,
        emailContactRequestBodyFactory(emailVerifiedPayload),
      );

      await app
        .get(PeachBorrowerQueueController)
        .emailVerifiedHandler(emailVerifiedPayload);

      expect(nock.isDone()).toEqual(true);
    });

    it('Should create user and active loan', async () => {
      const emailVerifiedPayload = emailVerifiedDataFactory();
      const creditLineCreatedPayload = creditLineCreatedDataFactory();
      const draw: Draw = drawFactory();
      setupCreateUserNock(
        config.get(ConfigVariables.PEACH_COMPANY_ID),
        userRequestBodyFactory(
          emailVerifiedPayload.email,
          config.get(ConfigVariables.PEACH_BORROWER_ROLE_ID),
          person.id,
        ),
      );
      setupCreateLoanNock(
        person.id,
        loanRequestBodyFactory(
          config.get(ConfigVariables.PEACH_LOAN_ID),
          creditLineCreatedPayload,
          homeAddress.id,
        ),
        creditLine,
      );
      setupActivateLoanNock(person.id, creditLine.id, {});
      setupCreateDrawNock(
        person.id,
        creditLine.id,
        drawRequestBodyFactory(),
        draw,
      );
      setupActivateDrawNock(person.id, creditLine.id, draw.id);

      await app
        .get(PeachBorrowerQueueController)
        .creditLineCreatedHandler(creditLineCreatedPayload);

      expect(nock.isDone()).toEqual(true);
    });

    describe('Credit limit updates', () => {
      const creditLimit: CreditLimit = creditLimitFactory();
      const balances: Balances = balancesFactory();
      let firstCreditLimitUpdatedPayload;

      beforeAll(() => {
        firstCreditLimitUpdatedPayload = creditLimitUpdatedDataFactory();
      });

      it('Should update the credit limit', async () => {
        setupUpdateCreditLimitNock(
          person.id,
          creditLine.id,
          creditLimitUpdateRequestBodyFactory(
            firstCreditLimitUpdatedPayload.creditLimit,
          ),
          creditLimit,
        );
        setupGetBalancesNock(person.id, creditLine.id, balances);

        await app
          .get(PeachBorrowerQueueController)
          .creditLimitUpdatedHandler(firstCreditLimitUpdatedPayload);

        expect(nock.isDone()).toEqual(true);
      });

      it('Should not update the credit limit if It was calculated before already handled event', async () => {
        const creditLimitUpdateRequest = setupUpdateCreditLimitNock(
          person.id,
          creditLine.id,
          creditLimitUpdateRequestBodyFactory(creditLimit.creditLimitAmount),
          creditLimit,
        );
        setupGetBalancesNock(person.id, creditLine.id, balances);

        await app.get(PeachBorrowerQueueController).creditLimitUpdatedHandler(
          creditLimitUpdatedDataFactory({
            ...firstCreditLimitUpdatedPayload,
            calculatedAt: Date.now() - 1000,
          }),
        );

        expect(creditLimitUpdateRequest.isDone()).toEqual(false);
      });

      it('Should throw error in case the lock for credit limit update is already taken', async () => {
        setupUpdateCreditLimitNock(
          person.id,
          creditLine.id,
          creditLimitUpdateRequestBodyFactory(creditLimit.creditLimitAmount),
          creditLimit,
          201,
          50,
        );
        setupGetBalancesNock(person.id, creditLine.id, balances);

        await expect(
          Promise.allSettled([
            app
              .get(PeachBorrowerQueueController)
              .creditLimitUpdatedHandler(creditLimitUpdatedDataFactory()),
            app.get(PeachBorrowerQueueController).creditLimitUpdatedHandler(
              creditLimitUpdatedDataFactory({
                creditLimit: 20,
              }),
            ),
          ]),
        ).resolves.toStrictEqual([
          { status: 'fulfilled', value: undefined },
          { reason: expect.any(LockedResourceError), status: 'rejected' },
        ]);

        expect(nock.isDone()).toEqual(true);
      });
    });
  });
});
