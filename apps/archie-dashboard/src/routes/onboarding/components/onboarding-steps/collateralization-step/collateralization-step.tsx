import { FC, useEffect, useState } from 'react';
import qrCode from '../../../../../assets/images/qr-code.png';
import { collateralCurrencies, CollateralCurrency } from '../../../../../constants/collateral-curencies';
import { step } from '../../../../../constants/onboarding-steps';
import { CollateralDeposit } from '../../../../../components/collateral-deposit/collateral-deposit';
import { Container } from '../../../../../components/_generic/layout/layout.styled';
import {
  SubtitleS,
  ParagraphM,
  ParagraphS,
  ParagraphXS,
} from '../../../../../components/_generic/typography/typography.styled';
import { Copy } from '../../../../../components/_generic/icons/copy';
import { Caret } from '../../../../../components/_generic/icons/caret';
import { StepsIndicator } from '../../steps-indicator/steps-indicator';
import { EmailVerification } from '../../email-verification/email-verification';
import { CollateralizationStepStyled } from './collateralization-step.styled';
import { InputRange } from '../../../../../components/_generic/input-range/input-range';
import { ExternalLink } from '../../../../../components/_generic/icons/external-link';
import { CollateralCurency } from '../../../../../components/collateral-curency/collateral-curency';

interface CollateralizationStepProps {
  setCurrentStep: (step: step) => void;
}

export const CollateralizationStep: FC<CollateralizationStepProps> = ({ setCurrentStep }) => {
  const [lineOfCredit, setLineOfCredit] = useState(100);
  const [selectOpen, setSelectOpen] = useState(false);
  const [selectedCollateralDeposit, setSelectedCollateralDeposit] = useState<CollateralCurrency>();
  const [collateralDeposit, setCollateralDeposit] = useState({ id: '', address: '' });
  const [requiredCollateral, setRequiredCollateral] = useState(0); // TBD

  useEffect(() => {
    const curency: CollateralCurrency | undefined = collateralCurrencies.find(
      (currency) => currency.id === collateralDeposit.id,
    );

    setSelectedCollateralDeposit(curency);
  }, [collateralDeposit.id]);

  return (
    <Container column mobileColumn>
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
            {collateralDeposit.address ? (
              <CollateralCurency
                icon={selectedCollateralDeposit?.icon}
                name={selectedCollateralDeposit?.name}
                short={selectedCollateralDeposit?.short}
              />
            ) : (
              'Select your collateral currency'
            )}
            <Caret className={selectOpen ? 'select-header-caret open' : 'select-header-caret'} />
          </div>
          {selectOpen && (
            <div className="select-list">
              {collateralCurrencies.map((asset, index) => (
                <div className="select-option" key={index} onClick={() => setSelectOpen(false)}>
                  <CollateralDeposit assetId={asset.id} setCollateralDeposit={setCollateralDeposit} />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="result">
          <div className="result-item">
            <ParagraphXS weight={700}>Required Collateral</ParagraphXS>
            <SubtitleS weight={400}>
              {requiredCollateral} {selectedCollateralDeposit?.short}
            </SubtitleS>
          </div>
          <div className="result-item">
            <ParagraphXS weight={700}>Loan-to-Value</ParagraphXS>
            <SubtitleS weight={400}>{selectedCollateralDeposit?.loan_to_value ?? '0%'}</SubtitleS>
          </div>
          <div className="result-item">
            <ParagraphXS weight={700}>Interest Rate</ParagraphXS>
            <SubtitleS weight={400}>{selectedCollateralDeposit?.interest_rate ?? '0%'}</SubtitleS>
          </div>
        </div>

        <div className="info">
          <div className="address">
            <div className="data">
              <ParagraphXS weight={700}>
                Send {requiredCollateral} {selectedCollateralDeposit?.short} to:
              </ParagraphXS>
              <div className="address-copy">
                <ParagraphS>{collateralDeposit.address}</ParagraphS>
                <button className="btn-copy" onClick={() => navigator.clipboard.writeText(collateralDeposit.address)}>
                  <Copy className="icon-copy" />
                </button>
              </div>
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
            <div className="code">
              <img src={qrCode} alt="QR code" />
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
        </div>
      </CollateralizationStepStyled>
    </Container>
  );
};
