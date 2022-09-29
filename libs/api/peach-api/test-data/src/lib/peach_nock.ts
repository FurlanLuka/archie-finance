import * as nock from 'nock';
import { PeachRequestBody, PeachResponse } from './peach';
import {
  Balances,
  CreditLimit,
  Draw,
  Person,
} from '@archie/api/peach-api/borrower';

let baseNock: nock.Scope;

export const setupBaseNock = (baseUrl: string, apiKey: string): nock.Scope => {
  baseNock = nock(baseUrl).matchHeader('X-API-KEY', apiKey);

  return baseNock;
};

export const setupCreatePersonNock = (
  payload: PeachRequestBody,
  replyData: Person,
  replyStatus = 201,
): nock.Interceptor => {
  const interceptor = baseNock.post('/people', payload);
  interceptor.reply(replyStatus, { data: replyData });

  return interceptor;
};

export const setupCreateContactNock = (
  personId: string,
  payload: PeachRequestBody,
  replyData: PeachResponse = {},
  replyStatus = 201,
): nock.Interceptor => {
  const interceptor = baseNock.post(`/people/${personId}/contacts`, payload);
  interceptor.reply(replyStatus, { data: replyData });

  return interceptor;
};

export const setupCreateUserNock = (
  companyId: string,
  payload: PeachRequestBody,
  replyData: PeachResponse = {},
  replyStatus = 201,
): nock.Interceptor => {
  const interceptor = baseNock.post(`/companies/${companyId}/users`, payload);
  interceptor.reply(replyStatus, { data: replyData });

  return interceptor;
};

export const setupCreateLoanNock = (
  personId: string,
  payload: PeachRequestBody,
  replyData: PeachResponse = {},
  replyStatus = 201,
): nock.Interceptor => {
  const interceptor = baseNock.post(`/people/${personId}/loans`, payload);
  interceptor.reply(replyStatus, { data: replyData });

  return interceptor;
};

export const setupActivateLoanNock = (
  personId: string,
  loanId: string,
  payload: PeachRequestBody,
  replyData: PeachResponse = {},
  replyStatus = 201,
): nock.Interceptor => {
  const interceptor = baseNock.post(
    `/people/${personId}/loans/${loanId}/activate`,
    payload,
  );
  interceptor.reply(replyStatus, { data: replyData });

  return interceptor;
};

export const setupCreateDrawNock = (
  personId: string,
  loanId: string,
  payload: PeachRequestBody,
  replyData: Draw,
  replyStatus = 201,
): nock.Interceptor => {
  const interceptor = baseNock.post(
    `/people/${personId}/loans/${loanId}/draws`,
    payload,
  );
  interceptor.reply(replyStatus, { data: replyData });

  return interceptor;
};

export const setupActivateDrawNock = (
  personId: string,
  loanId: string,
  drawId: string,
  replyData: PeachResponse = {},
  replyStatus = 201,
): nock.Interceptor => {
  const interceptor = baseNock.post(
    `/people/${personId}/loans/${loanId}/draws/${drawId}/activate`,
  );
  interceptor.reply(replyStatus, { data: replyData });

  return interceptor;
};

export const setupUpdateCreditLimitNock = (
  personId: string,
  loanId: string,
  payload: PeachRequestBody,
  replyData: CreditLimit,
  replyStatus = 201,
  delay = 0,
): nock.Interceptor => {
  const interceptor = baseNock.post(
    `/people/${personId}/loans/${loanId}/credit-limit`,
  );
  interceptor.delay(delay).reply(replyStatus, { data: replyData });

  return interceptor;
};

export const setupGetBalancesNock = (
  personId: string,
  loanId: string,
  replyData: Balances,
  replyStatus = 200,
): nock.Interceptor => {
  const interceptor = baseNock.get(
    `/people/${personId}/loans/${loanId}/balances`,
  );
  interceptor.reply(replyStatus, { data: replyData });

  // TODO: push to array & have ability to clean (create multiple instances - switch to object)

  return interceptor;
};
