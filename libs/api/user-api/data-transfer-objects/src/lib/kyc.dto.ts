export class KycSubmittedPayload {
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
  aptUnit: string | null;
  ssn: string;
}
