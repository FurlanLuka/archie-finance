import {
  KycDto,
  KycSubmittedPayload,
} from '@archie/api/user-api/data-transfer-objects';
import { user } from '@archie/test/integration';
import { DateTime } from 'luxon';

export const kycSubmittedDataFactory = (
  override?: Partial<KycSubmittedPayload>,
): KycSubmittedPayload => {
  return {
    userId: user.id,
    firstName: 'John',
    lastName: 'Doe',
    dateOfBirth: new Date(),
    addressStreet: 'Market St.',
    addressStreetNumber: '15',
    addressCountry: 'United States',
    addressLocality: 'CA',
    addressRegion: 'CA',
    addressPostalCode: '54000',
    phoneNumber: '+1343234567',
    phoneNumberCountryCode: 'US',
    ssn: '3324234234',
    aptUnit: '6',
    ...override,
  };
};

export const createKycBodyFactory = (override?: Partial<KycDto>): KycDto => {
  return {
    firstName: 'John',
    lastName: 'Doe',
    dateOfBirth: DateTime.now()
      .minus({
        year: 19,
      })
      .toJSDate(),
    addressStreet: 'Market St.',
    addressStreetNumber: '15',
    addressCountry: 'United States',
    addressLocality: 'CA',
    addressRegion: 'CA',
    addressPostalCode: '54000',
    phoneNumber: '343234567',
    phoneNumberCountryCode: '+1',
    ssn: '332423423',
    aptUnit: '6',
    income: 100,
    ...override,
  };
};
