import { FC } from 'react';
import { CollateralDeposit } from '../../../../../components/collateral-deposit/collateral-deposit';
import { Collateral } from '../../../../../components/collateral/collateral';
import { Container } from '../../../../../components/_generic/layout/layout.styled';
import { step } from '../../../onboarding-route'
import { StepsIndicator } from '../../steps-indicator/steps-indicator';
import { EmailVerification } from '../../email-verification/email-verification';
import { CollateralizationStepLayout } from './collateralization-step.styled'

interface CollateralizationStepProps {
  setCurrentStep: (step: step) => void;
}

export const CollateralizationStep: FC<CollateralizationStepProps> = ({ setCurrentStep }) => (
  <Container column>
    <StepsIndicator 
      title="Let’s get started"
      subtitle="It’s just a few steps to apply for ArchCredit and your Archie card"
      currentStep={step.COLLATERALIZE}
    />
    <EmailVerification />
    <CollateralizationStepLayout>
      <Collateral />
      <CollateralDeposit assetName="Bitcoin" assetId="BTC_TEST" />
      <CollateralDeposit assetName="Ethereum" assetId="ETH_TEST" />
      <CollateralDeposit assetName="USD Coin" assetId="USDC_T" />
      <CollateralDeposit assetName="Solana" assetId="SOL_TEST" />
    </CollateralizationStepLayout>
  </Container>
);

