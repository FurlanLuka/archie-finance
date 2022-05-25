import { FC } from 'react';
import { Formik, Form, Field, FormikValues } from 'formik';
import { format, parse, isDate, differenceInYears } from 'date-fns';
import * as Yup from 'yup';
import { RequestState } from '@archie/api-consumer/interface';
import { useCreateKyc } from '@archie/api-consumer/kyc/hooks/use-create-kyc';
import { step } from '../../../../../constants/onboarding-steps';
import { SubtitleS, ParagraphS } from '../../../../../components/_generic/typography/typography.styled';
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
    fullLegalName: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Please enter the required field'),
    dateOfBirth: Yup.date()
      .nullable()
      .test('dob', 'Should be older than 18', (value) => minYears(value ?? today))
      .max(today, 'Date cannot be in the future')
      .required('Please enter the required field'),
    country: Yup.string().required('Please enter the required field'),
    state: Yup.string().required('Please enter the required field'),
    ssnDigits: Yup.string()
      .matches(/^[0-9]+$/, 'Only digits')
      .test('len', 'Must be exactly 4 digits', (value) => value?.length === 4)
      .required('Please enter the required field'),
  });

  const handleSubmit = (values: FormikValues) => {
    if (mutationRequest.state === RequestState.IDLE) {
      mutationRequest.mutate({
        fullLegalName: values.fullLegalName,
        dateOfBirth: values.dateOfBirth.toISOString(),
        country: values.country,
        state: values.state,
        ssnDigits: values.ssnDigits,
      });

      console.log(values);

      setCurrentStep(step.COLLATERALIZE);
    }
  };

  return (
    <KycStepStyled>
      <SubtitleS>A bit about you</SubtitleS>
      <ParagraphS>
        We need to ask some personal information for compliance reasons. This information will not impact your credit
        score or your ability to get the Archie Card.
      </ParagraphS>
      <Formik
        initialValues={{
          fullLegalName: '',
          dateOfBirth: format(today, 'MM-dd-yyyy'),
          country: 'United states',
          state: '',
          ssnDigits: '',
        }}
        validationSchema={validation}
        onSubmit={(values) => handleSubmit(values)}
      >
        {({ errors, touched }) => (
          <Form>
            <InputText>
              Full legal name*
              <Field name="fullLegalName" placeholder="John Doe" />
              {errors.fullLegalName && touched.fullLegalName ? <div>{errors.fullLegalName}</div> : null}
            </InputText>
            <InputText>
              Date of birth*
              <Field name="dateOfBirth" placeholder="Date of birth" />
              {errors.dateOfBirth && touched.dateOfBirth ? <div>{errors.dateOfBirth}</div> : null}
            </InputText>
            <InputText>
              Country of residence*
              <Field name="country" placeholder="Country" disabled />
              {errors.country && touched.country ? <div>{errors.country}</div> : null}
            </InputText>
            <InputText>
              State of residence*
              <Field name="state" placeholder="State" />
              {errors.state && touched.state ? <div>{errors.state}</div> : null}
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
