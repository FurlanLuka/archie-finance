import { FC } from 'react';
import { Container } from '../../../../../components/_generic/layout/layout.styled';
import { ParagraphM, ParagraphS } from '../../../../../components/_generic/typography/typography.styled';
import { step } from '../../../onboarding-route'
import { StepsIndicator } from '../../steps-indicator/steps-indicator';
import { EmailVerification } from '../../email-verification/email-verification';
import { CardStepLayout } from './card-step.styled'


export const CardStep: FC = () => (
  <Container column>
    <StepsIndicator 
      title="Setting Up Your Archie Card"
      subtitle="There are a few steps to setup your ArchCredit and get your Archie card."
      currentStep={step.CARD}
    />
    <EmailVerification />
    <CardStepLayout>
      <ParagraphM>Your Archie Card is Ready!</ParagraphM>
      <ParagraphS>Make sure your email is verified before continuing.</ParagraphS>
    </CardStepLayout>
  </Container>  
);

