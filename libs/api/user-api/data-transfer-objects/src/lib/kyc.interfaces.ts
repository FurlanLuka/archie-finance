export interface KycSubmittedPayload {
  userId: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  addressStreet: string;
  addressStreetNumber: string;
  addressLocality: string;
  addressRegion: string;
  addressPostalCode: string;
  addressCountry: string;
  phoneNumber: string;
  phoneNumberCountryCode: string;
  income: number;
  aptUnit: string | null;
  ssn: string;
}

export interface KycResponse {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  addressStreet: string;
  addressStreetNumber: string;
  addressLocality: string;
  addressRegion: string;
  addressPostalCode: string;
  addressCountry: string;
  phoneNumber: string;
  phoneNumberCountryCode: string;
  ssn: string;
  income: number;
  aptUnit: string | null;
  createdAt: string;
}

export interface GetKycPayload {
  userId: string;
}
