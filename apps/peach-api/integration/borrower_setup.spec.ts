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
import { PeachBorrowerQueueController } from '@archie/api/peach-api/borrower';
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
import { ExecutionError } from '@archie-microservices/api/utils/redis';
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
} from '@archie-microservices/api/peach-api/test-data';

describe('Peach service tests', () => {
  let app: INestApplication;
  let module: TestingModule;
  let config: ConfigService;

  let testDatabase: TestDatabase;
  let baseNock: nock.Scope;

  const setup = async (): Promise<void> => {
    testDatabase = await createTestDatabase();

    module = await createTestingModule({
      imports: [AppModule],
    }).compile();

    app = await initializeTestingModule(module);

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
    afterEach(nock.cleanAll);

    const person: Person = personFactory();
    const homeAddress: HomeAddress = homeAddressContactFactory();
    const creditLine: CreditLine = creditLineFactory();

    it('Should store KYC info', async () => {
      const kycSubmittedPayload = kycSubmittedDataFactory();
      baseNock
        .post('/people', personRequestBodyFactory(kycSubmittedPayload))
        .reply(201, {
          data: person,
        });
      baseNock
        .post(
          `/people/${person.id}/contacts`,
          phoneContactRequestBodyFactory(kycSubmittedPayload),
        )
        .reply(201, {
          data: {},
        });
      baseNock
        .post(
          `/people/${person.id}/contacts`,
          homeAddressContactRequestBodyFactory(kycSubmittedPayload),
        )
        .reply(201, { data: homeAddress });

      await app
        .get(PeachBorrowerQueueController)
        .kycSubmittedHandler(kycSubmittedPayload);

      expect(nock.isDone()).toEqual(true);
    });

    it('Should store Email', async () => {
      const emailVerifiedPayload = emailVerifiedDataFactory();
      baseNock
        .post(
          `/people/${person.id}/contacts`,
          emailContactRequestBodyFactory(emailVerifiedPayload),
        )
        .reply(201, { data: {} });

      await app
        .get(PeachBorrowerQueueController)
        .emailVerifiedHandler(emailVerifiedPayload);

      expect(nock.isDone()).toEqual(true);
    });

    it('Should create user and active loan', async () => {
      const emailVerifiedPayload = emailVerifiedDataFactory();
      const creditLineCreatedPayload = creditLineCreatedDataFactory();
      const draw: Draw = drawFactory();
      baseNock
        .post(
          `/companies/${config.get(ConfigVariables.PEACH_COMPANY_ID)}/users`,
          userRequestBodyFactory(
            emailVerifiedPayload.email,
            config.get(ConfigVariables.PEACH_BORROWER_ROLE_ID),
            person.id,
          ),
        )
        .reply(201, { data: {} });
      baseNock
        .post(
          `/people/${person.id}/loans`,
          loanRequestBodyFactory(
            config.get(ConfigVariables.PEACH_LOAN_ID),
            creditLineCreatedPayload,
            homeAddress.id,
          ),
        )
        .reply(201, { data: creditLine });
      baseNock
        .post(`/people/${person.id}/loans/${creditLine.id}/activate`, {})
        .reply(201, { data: {} });
      baseNock
        .post(
          `/people/${person.id}/loans/${creditLine.id}/draws`,
          drawRequestBodyFactory(),
        )
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
      const creditLimit: CreditLimit = creditLimitFactory();
      const balances = balancesFactory();
      let firstCreditLimitUpdatedPayload;

      beforeAll(() => {
        firstCreditLimitUpdatedPayload = creditLimitUpdatedDataFactory();
      });

      it('Should update credit limit', async () => {
        baseNock
          .post(
            `/people/${person.id}/loans/${creditLine.id}/credit-limit`,
            creditLimitUpdateRequestBodyFactory(
              firstCreditLimitUpdatedPayload.creditLimit,
            ),
          )
          .reply(201, { data: creditLimit });
        baseNock
          .get(`/people/${person.id}/loans/${creditLine.id}/balances`)
          .reply(201, { data: balances });

        await app
          .get(PeachBorrowerQueueController)
          .creditLimitUpdatedHandler(firstCreditLimitUpdatedPayload);

        expect(nock.isDone()).toEqual(true);
      });

      it('Should not update the credit limit if calculated at is before the handled one', async () => {
        const creditLimitUpdateRequest = baseNock
          .post(`/people/${person.id}/loans/${creditLine.id}/credit-limit`, {
            creditLimitAmount: creditLimit.creditLimitAmount,
          })
          .reply(201, { data: creditLimit });
        baseNock
          .get(`/people/${person.id}/loans/${creditLine.id}/balances`)
          .reply(201, { data: balances });

        await app.get(PeachBorrowerQueueController).creditLimitUpdatedHandler(
          creditLimitUpdatedDataFactory({
            ...firstCreditLimitUpdatedPayload,
            calculatedAt: new Date(
              new Date(firstCreditLimitUpdatedPayload.calculatedAt).getTime() -
                1000,
            ).toISOString(),
          }),
        );

        expect(creditLimitUpdateRequest.isDone()).toEqual(false);
      });

      it('Should reject credit limit update in case the lock is already taken', async () => {
        baseNock
          .post(`/people/${person.id}/loans/${creditLine.id}/credit-limit`, {
            creditLimitAmount: creditLimit.creditLimitAmount,
          })
          .delay(100)
          .reply(201, { data: creditLimit });
        baseNock
          .get(`/people/${person.id}/loans/${creditLine.id}/balances`)
          .reply(201, { data: balances });

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
          { reason: expect.any(ExecutionError), status: 'rejected' },
        ]);

        expect(nock.isDone()).toEqual(true);
      });
    });
  });
});
