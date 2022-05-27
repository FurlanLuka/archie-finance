import { FC, useState } from 'react';
import { Formik, Form, Field, FormikValues } from 'formik';
import { format, differenceInYears } from 'date-fns';
import Autocomplete from 'react-google-autocomplete';
import PhoneInput, { Country } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import * as Yup from 'yup';
import { RequestState } from '@archie/api-consumer/interface';
import { useCreateKyc } from '@archie/api-consumer/kyc/hooks/use-create-kyc';
import { step } from '../../../../../constants/onboarding-steps';
import { SubtitleS, ParagraphXS } from '../../../../../components/_generic/typography/typography.styled';
import { ButtonPrimary } from '../../../../../components/_generic/button/button.styled';
import { InputText } from '../../../../../components/_generic/input-text/input-text.styled';
import { ArrowRight } from '../../../../../components/_generic/icons/arrow-right';
import { colors, theme } from '../../../../../constants/theme';
import { KycStepStyled } from './kyc-step.styled';

interface KycStepProps {
  setCurrentStep: (step: step) => void;
}

interface PhoneInputFieldProps {
  field: {
    name: string;
    value: string;
    onChange: (value: string) => void;
  };
  form: {
    setFieldValue: (name: string, phoneNumber: string) => void;
  };
  onChange: (phoneNumber: string) => void;
}

const PhoneInputField: FC<PhoneInputFieldProps> = ({ field: { name, value, onChange }, form: { setFieldValue } }) => {
  const onValueChange = (phoneNumber: string) => {
    setFieldValue(name, phoneNumber);

    if (onChange) {
      onChange(phoneNumber);
    }
  };

  return (
    <PhoneInput
      defaultCountry="US"
      addInternationalOption={false}
      countryCallingCodeEditable={false}
      placeholder="Enter phone number"
      name={name}
      value={value}
      onChange={onValueChange}
      onCountryChange={(country) => console.log(country)}
    />
  );
};

export const KycStep: FC<KycStepProps> = ({ setCurrentStep }) => {
  const mutationRequest = useCreateKyc();

  const today = new Date();
  const minYears = (value: Date) => differenceInYears(new Date(), new Date(value)) >= 18;

  const validation = Yup.object().shape({
    firstName: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Please enter your first name'),
    lastName: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Please enter your last name'),
    dateOfBirth: Yup.date()
      .nullable()
      .test('dob', 'Should be older than 18', (value) => minYears(value ?? today))
      .max(today, 'Date cannot be in the future')
      .required('Please enter your date of birth'),
    address: Yup.string().required('Please enter your address'),
    phoneNumber: Yup.string().required('Please enter your phone number'),
    // phoneNumberCountryCode: Yup.string().required('Please enter the required field'),
    ssnDigits: Yup.string()
      .matches(/^[0-9]+$/, 'Only digits')
      .test('len', 'Must be exactly 9 digits', (value) => value?.length === 9)
      .required('Please enter your SSN/TIN'),
  });

  const [phoneNumberCountryCode, setPhoneNumberCountryCode] = useState<Country>('US');

  const handleSubmit = (values: FormikValues) => {
    const payload = {
      firstName: values.firstName,
      lastname: values.lastName,
      dateOfBirth: values.dateOfBirth,
      address: values.address,
      phoneNumber: values.phoneNumber,
      phoneNumberCountryCode,
      ssnDigits: values.ssnDigits,
    };

    if (mutationRequest.state === RequestState.IDLE) {
      // mutationRequest.mutate({ payload });

      console.log(payload);

      setCurrentStep(step.COLLATERALIZE);
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
          address: '',
          phoneNumber: '',
          ssnDigits: '',
        }}
        validationSchema={validation}
        onSubmit={(values) => handleSubmit(values)}
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
                onPlaceSelected={(place) => {
                  console.log(place);
                }}
                options={{ types: ['address'] }}
              />
              {/* <Field name="address" placeholder="Street, City, State" />
              {errors.address && touched.address && (
                <ParagraphXS className="error" color={theme.textDanger}>
                  {errors.address}
                </ParagraphXS>
              )} */}
            </InputText>
            <InputText>
              Phone Number*
              {/* <PhoneInput
                defaultCountry={phoneNumberCountryCode}
                addInternationalOption={false}
                countryCallingCodeEditable={false}
                placeholder="Enter phone number"
                name="phoneNumber"
                value={phoneNumber}
                onChange={(value) => setPhoneNumber(value as string)}
                onCountryChange={(country: Country) => setPhoneNumberCountryCode(country)}
              /> */}
              <Field name="phoneNumber" component={PhoneInputField} />
              {errors.phoneNumber && touched.phoneNumber && (
                <ParagraphXS className="error" color={theme.textDanger}>
                  {errors.phoneNumber}
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
