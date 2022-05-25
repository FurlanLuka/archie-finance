import { FC } from 'react';
import { step } from '../../../../../constants/onboarding-steps';
import { Container } from '../../../../../components/_generic/layout/layout.styled';
import { SubtitleS, ParagraphXS } from '../../../../../components/_generic/typography/typography.styled';
import { StepsIndicator } from '../../steps-indicator/steps-indicator';
import { EmailVerification } from '../../email-verification/email-verification';
import imgCardReady from '../../../../../assets/images/img-card-ready.png';
import { CardStepStyled } from './card-step.styled';
import { ButtonPrimary } from '../../../../../components/_generic/button/button.styled';

export const CardStep: FC = () => (
  <Container column mobileColumn alignItems="center">
    <StepsIndicator currentStep={step.CARD} />
    <EmailVerification />
    <CardStepStyled>
      <SubtitleS>Your Archie Card is Ready!</SubtitleS>
      <ParagraphXS>
        You collateralized 0.15 BTC and have a $2,000 line of credit. Make sure <br /> your email is verified before
        continuing.
      </ParagraphXS>
      <div className="image">
        <img src={imgCardReady} alt="Your Archie card is ready" />
      </div>
      <ButtonPrimary
        maxWidth="16rem"
        // isDisabled={isEmailVerified} TBD
      >
        Go to dashboard
      </ButtonPrimary>
    </CardStepStyled>
  </Container>
);
