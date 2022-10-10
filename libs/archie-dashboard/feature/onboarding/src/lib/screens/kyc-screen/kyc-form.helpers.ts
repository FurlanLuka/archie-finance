import { parse } from 'date-fns';
import { FieldErrors } from 'react-hook-form';

export interface Address {
  addressStreet: string;
  addressStreetNumber: string;
  addressLocality: string;
  addressRegion: string;
  addressPostalCode: string;
  addressCountry: string;
}

interface GooglePlace {
  address_components: Array<{
    types: string[];
    long_name: string;
    short_name: string;
  }>;
  formatted_address: string;
}

export const addAddress = (place: GooglePlace): Partial<Address> => {
  const streetNumberComponent = place.address_components.find((item) => item.types.includes('street_number'));
  const streetNameComponent = place.address_components.find((item) => item.types.includes('route'));
  const localityComponent = place.address_components.find((item) => item.types.includes('locality'));
  const countryComponent = place.address_components.find((item) => item.types.includes('country'));
  const postalCodeComponent = place.address_components.find((item) => item.types.includes('postal_code'));
  const postalTownComponent = place.address_components.find((item) => item.types.includes('postal_town'));
  const regionComponent = place.address_components.find((item) => item.types.includes('administrative_area_level_1'));

  const addr: Partial<Address> = {
    addressStreet: streetNameComponent?.long_name,
    addressStreetNumber: streetNumberComponent?.long_name,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    addressLocality: localityComponent ? localityComponent.short_name : postalTownComponent!.long_name,
    addressCountry: countryComponent?.short_name,
    addressRegion: regionComponent?.short_name,
    addressPostalCode: postalCodeComponent?.short_name,
  };

  return addr;
};

export const getAddressError = (errors: FieldErrors<Address>) => Object.values(errors)[0].message ?? '';

export const parseDate = (value: string) => {
  const TO_SECONDS = 60
  const TO_MS = 1000
  const date = parse(value, 'MMddyyyy', new Date())

  // subtract the time zone offset of the local time zone
  const timezoneOffset = -date.getTimezoneOffset()
  return new Date(date.getTime() + timezoneOffset * TO_SECONDS * TO_MS);
};

export const formatIncome = (value?: number) => 
  value ? 
    value.toLocaleString(undefined, { maximumFractionDigits: 2 }) 
    : '';

export const getFormatTempalte = (value?: string) =>
  value ? 
    value.split('').reverse().reduce((entry, _, i) => {
      if ((i + 1) % 3 === 0 && i !== value.length - 1) {
        return `${entry}x,`;
      }
      return `${entry}x`;
    }, '').split('').reverse().join('')
    : '';
