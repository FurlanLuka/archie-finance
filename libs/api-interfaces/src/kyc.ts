export type CreateKycResponse = GetKycResponse;

export interface GetKycResponse {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  addressStreet: string;
  addressStreetNumber: string;
  addressLocality: string;
  addressCountry: string;
  addressRegion: string;
  addressPostalCode: string;
  phoneNumberCountryCode: string;
  phoneNumber: string;
  ssn: string;
}
