import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Formik, Form } from 'formik';
import { format, differenceInYears, isValid, parse, isFuture } from 'date-fns';
import Autocomplete from 'react-google-autocomplete';
import { templateFormatter, templateParser, parseDigit } from 'input-format';
import ReactInput from 'input-format/react';
import { RequestState } from '@archie/api-consumer/interface';
import { useCreateKyc } from '@archie/api-consumer/kyc/hooks/use-create-kyc';
import { SubtitleS, ParagraphXS, ParagraphS } from '../../../../../components/_generic/typography/typography.styled';
import { ButtonPrimary } from '../../../../../components/_generic/button/button.styled';
import { InputText } from '../../../../../components/_generic/input-text/input-text.styled';
import { ArrowRight } from '../../../../../components/_generic/icons/arrow-right';
import { colors, theme } from '../../../../../constants/theme';
import { KycStepStyled } from './kyc-step.styled';

interface GooglePlace {
  address_components: Array<{
    types: string[];
    long_name: string;
    short_name: string;
  }>;
  formatted_address: string;
}

interface Address {
  addressStreet: string;
  addressStreetNumber: string;
  addressLocality: string;
  addressRegion: string;
  addressPostalCode: string;
  addressCountry: string;
}

export const KycStep: FC = () => {
  const { t } = useTranslation();

  const mutationRequest = useCreateKyc();

  const today = new Date();
  const parsedDate = (value: string) => parse(value, 'MMddyyyy', new Date());
  const minYears = (value: Date) => differenceInYears(today, new Date(value)) < 18;

  const [firstName, setFirstName] = useState('');
  const [firstNameError, setFirstNameError] = useState('');

  const [lastName, setLastName] = useState('');
  const [lastNameError, setLastNameError] = useState('');

  const [dateOfBirth, setDateOfBirth] = useState(format(today, 'MMddyyyy'));
  const [dateOfBirthError, setDateOfBirthError] = useState('');

  const [address, setAddress] = useState<Address>();
  const [addressError, setAddressError] = useState('');

  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneNumberError, setPhoneNumberError] = useState('');
  const phoneNumberCountryCode = '+1';

  const [ssn, setSsn] = useState('');
  const [ssnError, setSsnError] = useState('');

  const addAddress = (place: GooglePlace) => {
    const streetNumberComponent = place.address_components.find((item) => item.types.includes('street_number'));
    const streetNameComponent = place.address_components.find((item) => item.types.includes('route'));
    const localityComponent = place.address_components.find((item) => item.types.includes('locality'));
    const countryComponent = place.address_components.find((item) => item.types.includes('country'));
    const postalCodeComponent = place.address_components.find((item) => item.types.includes('postal_code'));
    const postalTownComponent = place.address_components.find((item) => item.types.includes('postal_town'));
    const regionComponent = place.address_components.find((item) => item.types.includes('administrative_area_level_1'));

    if (
      streetNumberComponent &&
      streetNameComponent &&
      (localityComponent || postalTownComponent) &&
      countryComponent &&
      postalCodeComponent &&
      regionComponent
    ) {
      const addr: Address = {
        addressStreet: streetNameComponent.long_name,
        addressStreetNumber: streetNumberComponent.long_name,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        addressLocality: localityComponent ? localityComponent.short_name : postalTownComponent!.long_name,
        addressCountry: countryComponent.short_name,
        addressRegion: regionComponent.short_name,
        addressPostalCode: postalCodeComponent.short_name,
      };

      if (countryComponent.short_name !== 'US') {
        setAddressError(t('kyc_step.error.not_us_address'));
      } else {
        setAddress(addr);
        setAddressError('');
      }
    } else {
      setAddressError(t('kyc_step.error.no_street_number'));
    }
  };

  const validate = () => {
    if (!firstName) {
      setFirstNameError(t('kyc_step.error.missing_first_name'));
    } else if (firstName.length < 2) {
      setFirstNameError(t('kyc_step.error.too_short'));
    } else if (firstName.length > 50) {
      setFirstNameError(t('kyc_step.error.too_long'));
    } else {
      setFirstNameError('');
    }

    if (!lastName) {
      setLastNameError(t('kyc_step.error.missing_last_name'));
    } else if (lastName.length < 2) {
      setLastNameError(t('kyc_step.error.too_short'));
    } else if (lastName.length > 50) {
      setLastNameError(t('kyc_step.error.too_long'));
    } else {
      setLastNameError('');
    }

    if (!dateOfBirth) {
      setDateOfBirthError(t('kyc_step.error.missing_date_of_birth'));
    } else if (!isValid(parsedDate(dateOfBirth))) {
      setDateOfBirthError(t('kyc_step.error.not_valid_date'));
    } else if (minYears(parsedDate(dateOfBirth) ?? today)) {
      setDateOfBirthError(t('kyc_step.error.should_be_older'));
    } else if (isFuture(parsedDate(dateOfBirth))) {
      setDateOfBirthError(t('kyc_step.error.cannot_be_future'));
    } else {
      setDateOfBirthError('');
    }

    if (!address) {
      setAddressError(t('kyc_step.error.missing_address'));
    } else {
      setAddressError('');
    }

    if (!phoneNumber) {
      setPhoneNumberError(t('kyc_step.error.missing_phone_number'));
    } else if (phoneNumber.length < 10) {
      setPhoneNumberError(t('kyc_step.error.phone_number_digits'));
    } else {
      setPhoneNumberError('');
    }

    if (!ssn) {
      setSsnError(t('kyc_step.error.missing_ssn'));
    } else if (ssn.length < 9) {
      setSsnError(t('kyc_step.error.ssn_digits'));
    } else {
      setSsnError('');
    }
  };

  const hasLenght = (value: string | Array<string>) => value.length > 0;

  const handleSubmit = () => {
    if (
      hasLenght(firstName) &&
      !hasLenght(firstNameError) &&
      hasLenght(lastName) &&
      !hasLenght(lastNameError) &&
      hasLenght(dateOfBirth) &&
      !hasLenght(dateOfBirthError) &&
      address !== undefined &&
      hasLenght(phoneNumber) &&
      !hasLenght(phoneNumberError) &&
      hasLenght(ssn) &&
      !hasLenght(ssnError)
    ) {
      if (mutationRequest.state === RequestState.IDLE) {
        mutationRequest.mutate({
          firstName,
          lastName,
          dateOfBirth: parsedDate(dateOfBirth).toISOString(),
          ...address,
          phoneNumber,
          phoneNumberCountryCode,
          ssn,
        });
      }
    }
  };

  return (
    <KycStepStyled>
      <SubtitleS className="title">{t('kyc_step.title')}</SubtitleS>
      <ParagraphXS className="subtitle">{t('kyc_step.subtitle')}</ParagraphXS>
      <Formik
        initialValues={{}}
        onSubmit={handleSubmit}
        validate={validate}
        validateOnBlur={false}
        validateOnChange={false}
      >
        <Form>
          <div className="input-group">
            <InputText>
              {t('kyc_step.label.first_name')}
              <input
                name="firstName"
                value={firstName}
                placeholder={t('kyc_step.placeholder.first_name')}
                onChange={(e) => setFirstName(e.target.value)}
              />
              {firstNameError && (
                <ParagraphXS className="error" color={theme.textDanger}>
                  {firstNameError}
                </ParagraphXS>
              )}
            </InputText>
            <InputText>
              {t('kyc_step.label.last_name')}
              <input
                name="lastName"
                value={lastName}
                placeholder={t('kyc_step.placeholder.last_name')}
                onChange={(e) => setLastName(e.target.value)}
              />
              {lastNameError && (
                <ParagraphXS className="error" color={theme.textDanger}>
                  {lastNameError}
                </ParagraphXS>
              )}
            </InputText>
          </div>
          <InputText>
            {t('kyc_step.label.date_of_birth')}
            <ReactInput
              name="dateOfBirth"
              value={dateOfBirth}
              onChange={(value) => setDateOfBirth(value as string)}
              parse={templateParser('xx-xx-xxxx', parseDigit)}
              format={templateFormatter('xx-xx-xxxx')}
            />
            {dateOfBirthError && (
              <ParagraphXS className="error" color={theme.textDanger}>
                {dateOfBirthError}
              </ParagraphXS>
            )}
          </InputText>
          <InputText>
            {t('kyc_step.label.address')}
            <Autocomplete
              apiKey="AIzaSyA-k_VEX0soa2kljYKTjtFUg4irF3hKZwQ"
              onPlaceSelected={(place) => addAddress(place)}
              placeholder={t('kyc_step.placeholder.address')}
              options={{ types: ['address'] }}
            />
            {addressError && (
              <ParagraphXS className="error" color={theme.textDanger}>
                {addressError}
              </ParagraphXS>
            )}
          </InputText>
          <InputText>
            {t('kyc_step.label.phone_number')}
            <div className="phone-number">
              <ParagraphS weight={700}>+1</ParagraphS>
              <ReactInput
                name="phoneNumber"
                value={phoneNumber}
                placeholder={t('kyc_step.placeholder.phone_number')}
                onChange={(value) => setPhoneNumber(value as string)}
                parse={templateParser('(xxx) xxx-xxxx', parseDigit)}
                format={templateFormatter('(xxx) xxx-xxxx')}
              />
            </div>
            {phoneNumberError && (
              <ParagraphXS className="error" color={theme.textDanger}>
                {phoneNumberError}
              </ParagraphXS>
            )}
          </InputText>
          <InputText>
            {t('kyc_step.label.ssn')}
            <ReactInput
              name="ssn"
              value={ssn}
              placeholder={t('kyc_step.placeholder.ssn')}
              onChange={(value) => setSsn(value as string)}
              parse={templateParser('xxx-xx-xxxx', parseDigit)}
              format={templateFormatter('xxx-xx-xxxx')}
            />
            {ssnError && (
              <ParagraphXS className="error" color={theme.textDanger}>
                {ssnError}
              </ParagraphXS>
            )}
          </InputText>
          <hr className="divider" />
          <ButtonPrimary type="submit">
            {t('btn_next')}
            <ArrowRight fill={colors.white} />
          </ButtonPrimary>
        </Form>
      </Formik>
    </KycStepStyled>
  );
};
