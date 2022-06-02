import { FC, useEffect, useState } from 'react';
import QRCode from 'react-qr-code';
import { CollateralAsset, collateralAssets } from '../../../../../constants/collateral-assets';
import { Step } from '../../../../../constants/onboarding-steps';
import { Container } from '../../../../../components/_generic/layout/layout.styled';
import { SubtitleS, ParagraphS, ParagraphXS } from '../../../../../components/_generic/typography/typography.styled';
import { Copy } from '../../../../../components/_generic/icons/copy';
import { StepsIndicator } from '../../steps-indicator/steps-indicator';
import { EmailVerification } from '../../email-verification/email-verification';
import { CollateralizationStepStyled } from './collateralization-step.styled';
import { InputRange } from '../../../../../components/_generic/input-range/input-range';
import { InputSelect } from '../../../../../components/_generic/input-select/input-select';
import { ExternalLink } from '../../../../../components/_generic/icons/external-link';

import { theme } from '../../../../../constants/theme';

interface CollateralizationStepProps {
  setCurrentStep: (step: Step) => void;
}

export const CollateralizationStep: FC<CollateralizationStepProps> = ({ setCurrentStep }) => {
  const [lineOfCredit, setLineOfCredit] = useState(100);
  const [selectedCollateralDeposit, setSelectedCollateralDeposit] = useState<CollateralAsset>();
  const [collateralDeposit, setCollateralDeposit] = useState({ id: '', address: '' });
  const [requiredCollateral, setRequiredCollateral] = useState(0); // TBD

  useEffect(() => {
    const curency: CollateralAsset | undefined = collateralAssets.find((asset) => asset.id === collateralDeposit.id);

    setSelectedCollateralDeposit(curency);
  }, [collateralDeposit.id]);

  return (
    <Container column mobileColumn alignItems="center">
      <StepsIndicator currentStep={Step.COLLATERALIZE} />
      <EmailVerification />
      <CollateralizationStepStyled>
        <SubtitleS className="title">Send crypto to your collateral wallet</SubtitleS>
        <ParagraphXS className="subtitle">
          Choose your desired initial line of credit and which crypto asset you'd like to collateralize
        </ParagraphXS>

        <div className="inputs">
          <InputSelect
            collateralDeposit={collateralDeposit}
            setCollateralDeposit={setCollateralDeposit}
            selectedCollateralDeposit={selectedCollateralDeposit}
          />
          <InputRange label="Credit Amount" min={0} max={1500} value={lineOfCredit} onChange={setLineOfCredit} />
        </div>

        <div className="result">
          <div className="result-item">
            <ParagraphXS weight={700}>Required Collateral</ParagraphXS>
            <SubtitleS weight={400}>
              {requiredCollateral} {selectedCollateralDeposit?.short}
            </SubtitleS>
            <SubtitleS
              weight={400}
              color={theme.textDisabled}
              className={`placeholder ${collateralDeposit.address && 'fade-out'}`}
            >
              -/-
            </SubtitleS>
          </div>
          <div className="result-item">
            <ParagraphXS weight={700}>Loan-to-Value</ParagraphXS>
            <SubtitleS weight={400}>{selectedCollateralDeposit?.loan_to_value}</SubtitleS>
            <SubtitleS
              weight={400}
              color={theme.textDisabled}
              className={`placeholder ${collateralDeposit.address && 'fade-out'}`}
            >
              -/-
            </SubtitleS>
          </div>
          <div className="result-item">
            <ParagraphXS weight={700}>Interest Rate</ParagraphXS>
            <SubtitleS weight={400}>{selectedCollateralDeposit?.interest_rate}</SubtitleS>
            <SubtitleS
              weight={400}
              color={theme.textDisabled}
              className={`placeholder ${collateralDeposit.address && 'fade-out'}`}
            >
              -/-
            </SubtitleS>
          </div>
        </div>

        <div className="address">
          <ParagraphXS weight={700}>
            Send {requiredCollateral} {selectedCollateralDeposit?.short} to:
          </ParagraphXS>
          <div className="address-copy">
            <ParagraphS>{collateralDeposit.address}</ParagraphS>
            <button className="btn-copy" onClick={() => navigator.clipboard.writeText(collateralDeposit.address)}>
              <Copy className="icon-copy" />
            </button>
          </div>
          <div className="address-code">
            <div className="code">
              <QRCode value={collateralDeposit.address} size={96} />
            </div>
            <div className="info">
              <div className="info-group">
                <ParagraphXS>
                  Make sure you <b>only</b> send {selectedCollateralDeposit?.short} to this address.
                </ParagraphXS>
              </div>
              <div className="info-group">
                <ParagraphXS>We will wait for 3 confirmations before your collateral is accepted.</ParagraphXS>
                <ParagraphXS className="info-link">
                  Follow along on
                  <a
                    href={`${selectedCollateralDeposit?.url}/${collateralDeposit.address}`}
                    target="_blank"
                    rel="noreferrer"
                    className="info-link-url"
                  >
                    this blockchain explorer <ExternalLink className="info-link-icon" />
                  </a>
                </ParagraphXS>
              </div>
            </div>
          </div>

          <hr className="divider" />

          <div className="terms">
            <div className="terms-title">
              <ParagraphXS weight={700}>Terms & Conditions</ParagraphXS>
            </div>
            <ul className="terms-list">
              <li className="terms-list-item">
                <ParagraphXS>
                  You can only spend up to <b>{selectedCollateralDeposit?.loan_to_value}</b> of your line of credit.
                </ParagraphXS>
              </li>
              <li className="terms-list-item">
                <ParagraphXS>Pay monthly. We’ll be sure to send you a reminder each month!</ParagraphXS>
              </li>
              <li className="terms-list-item">
                <ParagraphXS>
                  You will be asked to pay down your balance or add collateral if <br /> your card balance goes about
                  your credit utilization.
                </ParagraphXS>
              </li>
            </ul>
          </div>
          <div className={`overlay ${collateralDeposit.address && 'fade-out'}`} />
        </div>
      </CollateralizationStepStyled>
    </Container>
  );
};
