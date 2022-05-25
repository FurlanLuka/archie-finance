import { FC } from 'react';
import { Formik, Form, Field, FormikValues } from 'formik';
import { format, differenceInYears } from 'date-fns';
import * as Yup from 'yup';
import { RequestState } from '@archie/api-consumer/interface';
import { useCreateKyc } from '@archie/api-consumer/kyc/hooks/use-create-kyc';
import { step } from '../../../../../constants/onboarding-steps';
import { SubtitleS, ParagraphXS } from '../../../../../components/_generic/typography/typography.styled';
import { ButtonPrimary } from '../../../../../components/_generic/button/button.styled';
import { InputText } from '../../../../../components/_generic/input-text/input-text.styled';
import { ArrowRight } from '../../../../../components/_generic/icons/arrow-right';
import { colors } from '../../../../../constants/theme';
import { KycStepStyled } from './kyc-step.styled';

interface KycStepProps {
  setCurrentStep: (step: step) => void;
}

export const KycStep: FC<KycStepProps> = ({ setCurrentStep }) => {
  const mutationRequest = useCreateKyc();

  const today = new Date();
  const minYears = (value: Date) => differenceInYears(new Date(), new Date(value)) >= 18;

  const validation = Yup.object().shape({
    firstName: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Please enter the required field'),
    lastName: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Please enter the required field'),
    dateOfBirth: Yup.date()
      .nullable()
      .test('dob', 'Should be older than 18', (value) => minYears(value ?? today))
      .max(today, 'Date cannot be in the future')
      .required('Please enter the required field'),
    address: Yup.string().required('Please enter the required field'),
    phoneNumber: Yup.string().required('Please enter the required field'),
    phoneNumberCountryCode: Yup.string().required('Please enter the required field'),
    ssnDigits: Yup.string()
      .matches(/^[0-9]+$/, 'Only digits')
      .test('len', 'Must be exactly 4 digits', (value) => value?.length === 4)
      .required('Please enter the required field'),
  });

  const handleSubmit = (values: FormikValues) => {
    if (mutationRequest.state === RequestState.IDLE) {
      mutationRequest.mutate({
        firstName: values.firstName,
        lastname: values.lastname,
        dateOfBirth: values.dateOfBirth.toISOString(),
        address: values.address,
        phoneNumber: values.phoneNumber,
        phoneNumberCountryCode: values.phoneNumberCountryCode,
        ssnDigits: values.ssnDigits,
      });

      console.log(values);

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
          phoneNumberCountryCode: '',
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
                {errors.firstName && touched.firstName ? <div>{errors.firstName}</div> : null}
              </InputText>
              <InputText>
                Last Name*
                <Field name="lastName" placeholder="Doe" />
                {errors.lastName && touched.lastName ? <div>{errors.lastName}</div> : null}
              </InputText>
            </div>
            <InputText>
              Date of birth*
              <Field name="dateOfBirth" placeholder="Date of birth" />
              {errors.dateOfBirth && touched.dateOfBirth ? <div>{errors.dateOfBirth}</div> : null}
            </InputText>
            <InputText>
              Address*
              <Field name="address" placeholder="Street, City, State" disabled />
              {errors.address && touched.address ? <div>{errors.address}</div> : null}
            </InputText>
            <InputText>
              Phone Number*
              <Field name="phoneNumber" placeholder="+386 30 248 965" />
              {errors.phoneNumber && touched.phoneNumber ? <div>{errors.phoneNumber}</div> : null}
            </InputText>
            <InputText>
              Last 4 SSN digits*
              <Field name="ssnDigits" placeholder="XXXX" />
              {errors.ssnDigits && touched.ssnDigits ? <div>{errors.ssnDigits}</div> : null}
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
