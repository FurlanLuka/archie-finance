import { Kyc } from '../kyc.entity';

export const getKycEntityData = (
  userId: string,
  overrides?: Partial<Kyc>,
): Kyc => {
  return {
    userId,
    firstName: 'John',
    lastName: 'Doe',
    address: 'Some random address',
    phoneNumberCountryCode: '+1',
    phoneNumber: '33',
    dateOfBirth: new Date().toISOString(),
    ssn: '4444',
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
};

export const getEncryptedKycEntityData = (
  userId: string,
  overrides?: Partial<Kyc>,
): Kyc => {
  return {
    userId,
    firstName: 'encrypted_name',
    lastName: 'encrypted_name',
    address: 'encrypted_address',
    phoneNumber: 'encrypted_phone',
    phoneNumberCountryCode: 'encrypted_phone_country_code',
    dateOfBirth: 'encrypted_date',
    ssn: 'encrypted_ssn',
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
};
