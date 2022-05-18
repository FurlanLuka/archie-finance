import { FC } from 'react';
import { Container } from '../../../../../components/_generic/layout/layout.styled';
import { ParagraphM, ParagraphS } from '../../../../../components/_generic/typography/typography.styled';
import { step } from '../../../onboarding-route';
import { StepsIndicator } from '../../steps-indicator/steps-indicator';
import { EmailVerification } from '../../email-verification/email-verification';
import imgCardReady from '../../../../../assets/images/img-card-ready.png';
import { CardStepStyled } from './card-step.styled';
import { ButtonPrimary } from '../../../../../components/_generic/button/button.styled';

export const CardStep: FC = () => (
  <Container column>
    <StepsIndicator
      title="Setting Up Your Archie Card"
      subtitle="There are a few steps to setup your ArchCredit and get your Archie card."
      currentStep={step.CARD}
    />
    <EmailVerification />
    <CardStepStyled>
      <ParagraphM weight={800}>Your Archie Card is Ready!</ParagraphM>
      <ParagraphS>You collateralized .15 BTC and have a $2,000 line of credit.</ParagraphS>
      <ParagraphS>Continue to the dashboard to start using your Archie Card.</ParagraphS>
      <hr className="divider" />
      <div className="image">
        <img src={imgCardReady} alt="Your Archie card is ready" />
      </div>
      <hr className="divider" />
      <ButtonPrimary
        maxWidth="16rem"
        // isDisabled={isEmailVerified} TBD
      >
        Go to dashboard
      </ButtonPrimary>
    </CardStepStyled>
  </Container>
);
