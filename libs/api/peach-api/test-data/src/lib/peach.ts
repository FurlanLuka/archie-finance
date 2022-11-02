import {
  Balances,
  CreditLimit,
  CreditLine,
  Draw,
  HomeAddress,
  IdentityType,
  Person,
  PersonStatus,
} from '@archie/api/peach-api/borrower';
import {
  EmailVerifiedPayload,
  KycSubmittedPayload,
} from '@archie/api/user-api/data-transfer-objects';
import { RequestBodyMatcher } from 'nock';
import { CreditLineCreatedPayload } from '@archie/api/credit-line-api/data-transfer-objects';
import { user } from '../../../../test/integration/src/lib/data-stubs';

export type PeachRequestBody = RequestBodyMatcher;
export type PeachResponse = Record<string, unknown>;

export const personFactory = (override?: Partial<Person>): Person => ({
  id: 'personId',
  companyId: 'companyId',
  ...override,
});

export const homeAddressContactFactory = (
  override?: Partial<HomeAddress>,
): HomeAddress => ({
  id: 'personId',
  ...override,
});

export const creditLineFactory = (
  override?: Partial<CreditLine>,
): CreditLine => ({
  id: 'creditLineId',
  atOrigination: {
    aprEffective: 16,
    aprNominal: 0,
  },
  ...override,
});

export const drawFactory = (override?: Partial<Draw>): Draw => ({
  id: 'drawId',
  ...override,
});

export const creditLimitFactory = (
  override?: Partial<CreditLimit>,
): CreditLimit => ({
  creditLimitAmount: 100,
  ...override,
});

export const balancesFactory = (override?: Partial<Balances>): Balances => ({
  isLocked: false,
  availableCreditAmount: 100,
  creditLimitAmount: 100,
  calculatedAt: new Date().toISOString(),
  outstandingBalances: {
    outstandingFeesAmount: 100,
    outstandingInterestAmount: 0,
    outstandingPrincipalAmount: 100,
    outstandingTotalAmount: 100,
  },
  overdueBalances: {
    overdueFeesAmount: 0,
    overdueInterestAmount: 0,
    overduePrincipalAmount: 0,
    overdueTotalAmount: 0,
  },
  dueBalances: {
    dueFeesAmount: 0,
    dueInterestAmount: 0,
    duePrincipalAmount: 0,
    dueTotalAmount: 0,
  },
  utilizationAmount: 0,
  ...override,
});

export const personRequestBodyFactory = (
  kyc: KycSubmittedPayload,
): PeachRequestBody => ({
  externalId: user.id,
  status: PersonStatus.active,
  name: {
    firstName: kyc.firstName,
    lastName: kyc.lastName,
  },
  dateOfBirth: kyc.dateOfBirth.toISOString(),
  identity: {
    identityType: IdentityType.SSN,
    value: kyc.ssn,
  },
});

export const homeAddressContactRequestBodyFactory = (
  kyc: KycSubmittedPayload,
): PeachRequestBody => ({
  contactType: 'address',
  label: 'home',
  affiliation: 'self',
  status: 'primary',
  address: {
    addressLine1: `${kyc.addressStreetNumber} ${kyc.addressStreet}`,
    city: kyc.addressLocality,
    state: kyc.addressRegion,
    postalCode: kyc.addressPostalCode,
    country: kyc.addressCountry,
  },
});

export const phoneContactRequestBodyFactory = (
  kyc: KycSubmittedPayload,
): PeachRequestBody => ({
  contactType: 'phone',
  label: 'personal',
  affiliation: 'self',
  status: 'primary',
  value: `${kyc.phoneNumberCountryCode}${kyc.phoneNumber}`,
  valid: true,
  verified: false,
  receiveTextMessages: false,
});

export const emailContactRequestBodyFactory = (
  email: EmailVerifiedPayload,
): PeachRequestBody => ({
  contactType: 'email',
  label: 'personal',
  affiliation: 'self',
  status: 'primary',
  value: email.email,
  valid: true,
  verified: true,
});

export const userRequestBodyFactory = (
  email: string,
  borrowerRoleId: string,
  personId: string,
): PeachRequestBody => ({
  userType: 'borrower',
  authType: {
    email: email,
  },
  roles: [borrowerRoleId],
  associatedPersonId: personId,
});

export const loanRequestBodyFactory = (
  loanTypeId: string,
  creditLineCreatedPayload: CreditLineCreatedPayload,
  homeAddressId: string,
): PeachRequestBody => ({
  loanTypeId: loanTypeId,
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
    creditLimitAmount: creditLineCreatedPayload.creditLimit,
    downPaymentAmount: creditLineCreatedPayload.ledgerValue,
    personAddressId: homeAddressId,
  },
});

export const drawRequestBodyFactory = (): PeachRequestBody => ({
  nickname: 'Credit Card',
  status: 'originated',
  atOrigination: {},
});

export const creditLimitUpdateRequestBodyFactory = (
  creditLimitAmount?: number,
): PeachRequestBody => ({
  creditLimitAmount: creditLimitAmount ?? 100,
});
