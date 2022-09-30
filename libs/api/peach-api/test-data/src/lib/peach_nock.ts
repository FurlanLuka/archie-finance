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
): nock.Scope => {
  return baseNock
    .post('/people', payload)
    .reply(replyStatus, { data: replyData });
};

export const setupCreateContactNock = (
  personId: string,
  payload: PeachRequestBody,
  replyData: PeachResponse = {},
  replyStatus = 201,
): nock.Scope => {
  return baseNock
    .post(`/people/${personId}/contacts`, payload)
    .reply(replyStatus, { data: replyData });
};

export const setupCreateUserNock = (
  companyId: string,
  payload: PeachRequestBody,
  replyData: PeachResponse = {},
  replyStatus = 201,
): nock.Scope => {
  return baseNock
    .post(`/companies/${companyId}/users`, payload)
    .reply(replyStatus, { data: replyData });
};

export const setupCreateLoanNock = (
  personId: string,
  payload: PeachRequestBody,
  replyData: PeachResponse = {},
  replyStatus = 201,
): nock.Scope => {
  return baseNock
    .post(`/people/${personId}/loans`, payload)
    .reply(replyStatus, { data: replyData });
};

export const setupActivateLoanNock = (
  personId: string,
  loanId: string,
  payload: PeachRequestBody,
  replyData: PeachResponse = {},
  replyStatus = 201,
): nock.Scope => {
  return baseNock
    .post(`/people/${personId}/loans/${loanId}/activate`, payload)
    .reply(replyStatus, { data: replyData });
};

export const setupCreateDrawNock = (
  personId: string,
  loanId: string,
  payload: PeachRequestBody,
  replyData: Draw,
  replyStatus = 201,
): nock.Scope => {
  return baseNock
    .post(`/people/${personId}/loans/${loanId}/draws`, payload)
    .reply(replyStatus, { data: replyData });
};

export const setupActivateDrawNock = (
  personId: string,
  loanId: string,
  drawId: string,
  replyData: PeachResponse = {},
  replyStatus = 201,
): nock.Scope => {
  return baseNock
    .post(`/people/${personId}/loans/${loanId}/draws/${drawId}/activate`)
    .reply(replyStatus, { data: replyData });
};

export const setupUpdateCreditLimitNock = (
  personId: string,
  loanId: string,
  payload: PeachRequestBody,
  replyData: CreditLimit,
  replyStatus = 201,
  delay = 0,
): nock.Scope => {
  return baseNock
    .post(`/people/${personId}/loans/${loanId}/credit-limit`)
    .delay(delay)
    .reply(replyStatus, { data: replyData });
};

export const setupGetBalancesNock = (
  personId: string,
  loanId: string,
  replyData: Balances,
  replyStatus = 200,
): nock.Scope => {
  return baseNock
    .get(`/people/${personId}/loans/${loanId}/balances`)
    .reply(replyStatus, { data: replyData });
};
