import { FC, useState } from 'react';
import qrCode from '../../../../../assets/images/qr-code.png';
import { CollateralDeposit } from '../../../../../components/collateral-deposit/collateral-deposit';
import { Container } from '../../../../../components/_generic/layout/layout.styled';
import {
  SubtitleS,
  ParagraphM,
  ParagraphS,
  ParagraphXS,
} from '../../../../../components/_generic/typography/typography.styled';
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
  const [address, setAddress] = useState('');
  const [selectOpen, setSelectOpen] = useState(false);

  const collateralCurency = [
    {
      name: 'Bitcoin',
      id: 'BTC_TEST',
      short: 'BTC',
    },
    {
      name: 'Ethereum',
      id: 'ETH_TEST',
      short: 'ETH',
    },
    {
      name: 'Solana',
      id: 'SOL_TEST',
      short: 'SOL',
    },
    {
      name: 'USD Coin',
      id: 'USDC_T',
      short: 'USDC',
    },
  ];

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

        <div className="select">
          <div className="select-header" onClick={() => setSelectOpen(!selectOpen)}>
            Select your collateral currency
          </div>
          {selectOpen && (
            <div className="select-list">
              {collateralCurency.map((asset, index) => (
                <div className="select-option" key={index} onClick={() => setSelectOpen(false)}>
                  <CollateralDeposit assetName={asset.name} assetId={asset.id} setAddress={setAddress} />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="result">
          <div className="result-item">
            <ParagraphXS weight={700}>Required Collateral</ParagraphXS>
            <SubtitleS weight={400}>0</SubtitleS>
          </div>
          <div className="result-item">
            <ParagraphXS weight={700}>Loan-to-Value</ParagraphXS>
            <SubtitleS weight={400}>0%</SubtitleS>
          </div>
          <div className="result-item">
            <ParagraphXS weight={700}>Interest Rate</ParagraphXS>
            <SubtitleS weight={400}>0%</SubtitleS>
          </div>
        </div>

        <div className="info">
          <div className="address">
            <div className="data">
              <ParagraphXS weight={700}>Send 0.12 BTC to:</ParagraphXS>
              <div className="address-copy">
                <ParagraphS>{address}</ParagraphS>
              </div>
            </div>
            <div className="code">
              <img src={qrCode} alt="QR code" />
            </div>
          </div>
          <div className="terms"></div>
        </div>
      </CollateralizationStepStyled>
    </Container>
  );
};
