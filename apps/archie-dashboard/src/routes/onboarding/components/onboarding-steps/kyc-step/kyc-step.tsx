import { FC, useState } from 'react';
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

      setAddress(addr);
      setAddressError('');
    } else {
      setAddressError('Please enter your street number');
    }
  };

  const validate = () => {
    if (!firstName) {
      setFirstNameError('Please enter your first name');
    } else if (firstName.length < 2) {
      setFirstNameError('Too Short!');
    } else if (firstName.length > 50) {
      setFirstNameError('Too Long!');
    } else {
      setFirstNameError('');
    }

    if (!lastName) {
      setLastNameError('Please enter your last name');
    } else if (lastName.length < 2) {
      setLastNameError('Too Short!');
    } else if (lastName.length > 50) {
      setLastNameError('Too Long!');
    } else {
      setLastNameError('');
    }

    if (!dateOfBirth) {
      setDateOfBirthError('Please enter your date of birth');
    } else if (!isValid(parsedDate(dateOfBirth))) {
      setDateOfBirthError('Not a valid date');
    } else if (minYears(parsedDate(dateOfBirth) ?? today)) {
      setDateOfBirthError('Should be older than 18');
    } else if (isFuture(parsedDate(dateOfBirth))) {
      setDateOfBirthError('Date cannot be in the future');
    } else {
      setDateOfBirthError('');
    }

    if (!address) {
      setAddressError('Please enter your address');
    } else {
      setAddressError('');
    }

    if (!phoneNumber) {
      setPhoneNumberError('Please enter your phone number');
    } else if (phoneNumber.length < 10) {
      setPhoneNumberError('Must consist of 10 digits');
    } else {
      setPhoneNumberError('');
    }

    if (!ssn) {
      setSsnError('Please enter your SSN/TIN');
    } else if (ssn.length < 9) {
      setSsnError('Must be exactly 9 digits');
    } else {
      setSsnError('');
    }
  };

  const hasLenght = (value: string | Array<string>) => value.length > 0;

  const handleSubmit = () => {
    const payload = {
      firstName,
      lastName,
      dateOfBirth: parsedDate(dateOfBirth).toISOString(),
      ...address,
      phoneNumber,
      phoneNumberCountryCode,
      ssn,
    };

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
        mutationRequest.mutate(payload);

        console.log(payload);
      }
    }
  };

  return (
    <KycStepStyled>
      <SubtitleS className="title">A bit about you</SubtitleS>
      <ParagraphXS className="subtitle">
        We need to ask some personal information for compliance reasons. This information will not impact your credit
        score or your ability to get the Archie Card.
      </ParagraphXS>
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
              First Name*
              <input
                name="firstName"
                value={firstName}
                placeholder="Joe"
                onChange={(e) => setFirstName(e.target.value)}
              />
              {firstNameError && (
                <ParagraphXS className="error" color={theme.textDanger}>
                  {firstNameError}
                </ParagraphXS>
              )}
            </InputText>
            <InputText>
              Last Name*
              <input name="lastName" value={lastName} placeholder="Doe" onChange={(e) => setLastName(e.target.value)} />
              {lastNameError && (
                <ParagraphXS className="error" color={theme.textDanger}>
                  {lastNameError}
                </ParagraphXS>
              )}
            </InputText>
          </div>
          <InputText>
            Date of birth*
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
            Address*
            <Autocomplete
              apiKey="AIzaSyA-k_VEX0soa2kljYKTjtFUg4irF3hKZwQ"
              onPlaceSelected={(place) => addAddress(place)}
              options={{ types: ['address'] }}
            />
            {addressError && (
              <ParagraphXS className="error" color={theme.textDanger}>
                {addressError}
              </ParagraphXS>
            )}
          </InputText>
          <InputText>
            Phone Number*
            <div className="phone-number">
              <ParagraphS weight={700}>+1</ParagraphS>
              <ReactInput
                name="phoneNumber"
                value={phoneNumber}
                placeholder="Enter phone number"
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
            SSN/TIN*
            <ReactInput
              name="ssn"
              value={ssn}
              placeholder="XXX-XX-XXXX"
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
            Next
            <ArrowRight fill={colors.white} />
          </ButtonPrimary>
        </Form>
      </Formik>
    </KycStepStyled>
  );
};
