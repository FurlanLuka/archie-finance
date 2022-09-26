import { differenceInYears, isValid, isFuture } from 'date-fns';
import * as yup from 'yup';

import { parseDate } from './kyc-form.helpers';

const minYears = (value: Date) => differenceInYears(new Date(), new Date(value)) < 18;
const maxYears = (value: Date) => differenceInYears(new Date(), new Date(value)) > 122;

const SUPPORTED_COUNTRIES = ['US'];

export const KycSchema = yup.object({
  firstName: yup
    .string()
    .required('kyc_step.error.required_field')
    .min(2, 'kyc_step.error.too_short')
    .max(50, 'kyc_step.error.too_long'),
  lastName: yup
    .string()
    .required('kyc_step.error.required_field')
    .min(2, 'kyc_step.error.too_short')
    .max(50, 'kyc_step.error.too_long'),
  dateOfBirth: yup
    .string()
    .required('kyc_step.error.required_field')
    .test('is_date_valid', 'kyc_step.error.not_valid_date', (value) => {
      if (!value) {
        return false;
      }

      return isValid(parseDate(value));
    })
    .test('minimum_age_test', 'kyc_step.error.should_be_older', (value) => {
      if (!value) {
        return false;
      }
      return !minYears(parseDate(value));
    })
    .test('maximum_age_test', 'kyc_step.error.should_be_under', (value) => {
      if (!value) {
        return false;
      }
      return !maxYears(parseDate(value));
    })
    .test('future_birthday_test', 'kyc_step.error.cannot_be_future', (value) => {
      if (!value) {
        return false;
      }
      return !isFuture(parseDate(value));
    }),
  address: yup.object({
    addressStreet: yup.string().required('kyc_step.error.not_full_address'),
    addressStreetNumber: yup.string().required('kyc_step.error.no_street_number'),
    addressLocality: yup.string().required('kyc_step.error.not_full_address'),
    addressCountry: yup
      .string()
      .required('kyc_step.error.not_full_address')
      .oneOf(SUPPORTED_COUNTRIES, 'kyc_step.error.not_us_address'),
    addressRegion: yup.string().required('kyc_step.error.not_full_address'),
    addressPostalCode: yup.string().required('kyc_step.error.not_full_address'),
  }),
  aptUnit: yup.string(),
  phoneNumber: yup.string().required('kyc_step.error.required_field').min(10, 'kyc_step.error.phone_number_digits'),
  ssn: yup.string().required('kyc_step.error.required_field').length(9, 'kyc_step.error.ssn_digits'),
  income: yup.string().required('kyc_step.error.required_field').length(5, 'kyc_step.error.income_digits'),
});
