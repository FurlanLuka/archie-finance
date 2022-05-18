import { FC, useState } from 'react';
import { CollateralDeposit } from '../../../../../components/collateral-deposit/collateral-deposit';
import { Container } from '../../../../../components/_generic/layout/layout.styled';
import { ParagraphM, ParagraphS } from '../../../../../components/_generic/typography/typography.styled';
import { step } from '../../../onboarding-route';
import { StepsIndicator } from '../../steps-indicator/steps-indicator';
import { EmailVerification } from '../../email-verification/email-verification';
import { CollateralizationStepStyled } from './collateralization-step.styled';
import { InputRange } from '../../../../../components/_generic/input-range/input-range';

interface CollateralizationStepProps {
  setCurrentStep: (step: step) => void;
}

export const CollateralizationStep: FC<CollateralizationStepProps> = ({ setCurrentStep }) => {
  const [lineOfCredit, setLineOfCredit] = useState(100);

  return (
    <Container column>
      <StepsIndicator
        title="Let’s get started"
        subtitle="It’s just a few steps to setup your ArchCredit and get your Archie card."
        currentStep={step.COLLATERALIZE}
      />
      <EmailVerification />
      <CollateralizationStepStyled>
        <ParagraphM weight={800} className="title">
          Send crypto to your collateral wallet
        </ParagraphM>
        <ParagraphS className="subtitle">
          Choose your desired initial line of credit and which crypto asset you’d <br /> like to collateralize.
        </ParagraphS>

        <InputRange label="Line of credit" min={0} max={1500} value={lineOfCredit} onChange={setLineOfCredit} />

        {/* <CollateralDeposit assetName="Bitcoin" assetId="BTC_TEST" />
      <CollateralDeposit assetName="Ethereum" assetId="ETH_TEST" />
      <CollateralDeposit assetName="USD Coin" assetId="USDC_T" />
      <CollateralDeposit assetName="Solana" assetId="SOL_TEST" /> */}
      </CollateralizationStepStyled>
    </Container>
  );
};
