import { KycSubmittedPayload } from '@archie/api/user-api/data-transfer-objects';
import { user } from '@archie/test/integration';

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
