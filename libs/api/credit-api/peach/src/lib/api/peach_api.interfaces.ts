import { AxiosRequestConfig } from 'axios';

export enum PersonStatus {
  active = 'active',
  inactive = 'inactive',
}

export enum IdentityType {
  SSN = 'SSN',
  ITIN = 'ITIN',
  passport = 'passport',
  driversLicense = 'driversLicense',
  taxID = 'taxID',
  FEIN = 'FEIN',
}

export type PeachResponse = Record<string, unknown>;

export interface Person extends PeachResponse {
  id: string;
  companyId: string;
}

export interface HomeAddress extends PeachResponse {
  id: string;
}

export interface CreditLine extends PeachResponse {
  id: string;
}

export interface CreditLimit extends PeachResponse {
  creditLimitAmount: number;
}

export interface PeachErrorResponse {
  config: AxiosRequestConfig;
  status: number;
  errorResponse: PeachErrorData;
}

export interface PeachErrorData {
  message: string;
  status: number;
}
