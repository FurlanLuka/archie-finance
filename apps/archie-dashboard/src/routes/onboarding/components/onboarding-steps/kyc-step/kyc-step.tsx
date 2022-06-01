import { FC, useState } from 'react';
import { Formik, Form, Field, FormikValues } from 'formik';
import { format, differenceInYears } from 'date-fns';
import Autocomplete from 'react-google-autocomplete';
import PhoneInput, { Country } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import * as Yup from 'yup';
import { RequestState } from '@archie/api-consumer/interface';
import { useCreateKyc } from '@archie/api-consumer/kyc/hooks/use-create-kyc';
import { Step } from '../../../../../constants/onboarding-steps';
import { SubtitleS, ParagraphXS } from '../../../../../components/_generic/typography/typography.styled';
import { ButtonPrimary } from '../../../../../components/_generic/button/button.styled';
import { InputText } from '../../../../../components/_generic/input-text/input-text.styled';
import { ArrowRight } from '../../../../../components/_generic/icons/arrow-right';
import { colors, theme } from '../../../../../constants/theme';
import { KycStepStyled } from './kyc-step.styled';

interface KycStepProps {
  setCurrentStep: (step: Step) => void;
}

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

export const KycStep: FC<KycStepProps> = ({ setCurrentStep }) => {
  const mutationRequest = useCreateKyc();

  const today = new Date();
  const minYears = (value: Date) => differenceInYears(new Date(), new Date(value)) >= 18;

  const validationSchema = Yup.object().shape({
    firstName: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Please enter your first name'),
    lastName: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Please enter your last name'),
    dateOfBirth: Yup.date()
      .test('dob', 'Should be older than 18', (value) => minYears(value ?? today))
      .max(today, 'Date cannot be in the future')
      .required('Please enter your date of birth'),
    ssnDigits: Yup.string()
      .matches(/^[0-9]+$/, 'Only digits')
      .test('len', 'Must be exactly 9 digits', (value) => value?.length === 9)
      .required('Please enter your SSN/TIN'),
  });

  const [address, setAddress] = useState<Address>();
  const [addressError, setAddressError] = useState('');

  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneNumberError, setPhoneNumberError] = useState('');
  const [phoneNumberCountryCode, setPhoneNumberCountryCode] = useState('+1');

  const addAddress = (place: GooglePlace) => {
    console.log(place);
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
    if (!address) {
      setAddressError('Please enter your address');
    } else {
      setAddressError('');
    }

    if (!phoneNumber) {
      setPhoneNumberError('Please enter your phone number');
    } else {
      setPhoneNumberError('');
    }
  };

  const hasLength = (value: string) => value.length > 0;

  const handleSubmit = (values: FormikValues) => {
    const payload = {
      firstName: values.firstName,
      lastName: values.lastName,
      dateOfBirth: values.dateOfBirth,
      ...address,
      phoneNumber,
      phoneNumberCountryCode,
      ssn: values.ssnDigits,
    };

    if (address !== undefined && hasLength(phoneNumber)) {
      if (mutationRequest.state === RequestState.IDLE) {
        mutationRequest.mutate(payload);

        console.log(payload);

        // setCurrentStep(step.COLLATERALIZE);
      }
    }
  };

  return (
    <KycStepStyled>
      <SubtitleS>A bit about you</SubtitleS>
      <ParagraphXS>
        We need to ask some personal information for compliance reasons. This information will not impact your credit
        score or your ability to get the Archie Card.
      </ParagraphXS>
      <Formik
        initialValues={{
          firstName: '',
          lastName: '',
          dateOfBirth: format(today, 'MM-dd-yyyy'),
          ssnDigits: '',
        }}
        validationSchema={validationSchema}
        onSubmit={(values) => handleSubmit(values)}
        validate={validate}
        validateOnBlur={false}
        validateOnChange={false}
      >
        {({ errors, touched }) => (
          <Form>
            <div className="input-group">
              <InputText>
                First Name*
                <Field name="firstName" placeholder="John" />
                {errors.firstName && touched.firstName && (
                  <ParagraphXS className="error" color={theme.textDanger}>
                    {errors.firstName}
                  </ParagraphXS>
                )}
              </InputText>
              <InputText>
                Last Name*
                <Field name="lastName" placeholder="Doe" />
                {errors.lastName && touched.lastName && (
                  <ParagraphXS className="error" color={theme.textDanger}>
                    {errors.lastName}
                  </ParagraphXS>
                )}
              </InputText>
            </div>
            <InputText>
              Date of birth*
              <Field name="dateOfBirth" placeholder="Date of birth" />
              {errors.dateOfBirth && touched.dateOfBirth ? (
                <ParagraphXS className="error" color={theme.textDanger}>
                  {errors.dateOfBirth}
                </ParagraphXS>
              ) : null}
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
              <PhoneInput
                defaultCountry={'US'}
                international={false}
                addInternationalOption={false}
                countryCallingCodeEditable={false}
                placeholder="Enter phone number"
                name="phoneNumber"
                value={phoneNumber}
                onChange={(value) => setPhoneNumber(value as string)}
                onCountryChange={(country: Country) => setPhoneNumberCountryCode(country)}
              />
              {phoneNumberError && (
                <ParagraphXS className="error" color={theme.textDanger}>
                  {phoneNumberError}
                </ParagraphXS>
              )}
            </InputText>
            <InputText>
              SSN/TIN*
              <Field name="ssnDigits" placeholder="XXX-XX-XXXX" />
              {errors.ssnDigits && touched.ssnDigits && (
                <ParagraphXS className="error" color={theme.textDanger}>
                  {errors.ssnDigits}
                </ParagraphXS>
              )}
            </InputText>
            <hr className="divider" />
            <ButtonPrimary type="submit">
              Next
              <ArrowRight fill={colors.white} />
            </ButtonPrimary>
          </Form>
        )}
      </Formik>
    </KycStepStyled>
  );
};
