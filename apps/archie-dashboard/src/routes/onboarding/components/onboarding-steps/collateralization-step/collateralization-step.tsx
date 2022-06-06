import { FC, useEffect, useState } from 'react';
import QRCode from 'react-qr-code';
import { QueryResponse, RequestState } from '@archie/api-consumer/interface';
import { useGetAssetPrice } from '@archie/api-consumer/asset_price/hooks/use-get-asset-price';
import { AssetPrice } from '@archie/api-consumer/asset_price/api/get-asset-price';
import { GetDepositAddressResponse } from '@archie/api-consumer/deposit_address/api/get-deposit-address';
import { useGetDepositAddress } from '@archie/api-consumer/deposit_address/hooks/use-get-deposit-address';
import { CollateralAsset } from '../../../../../constants/collateral-assets';
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
import { Collateral } from '../../../../../components/collateral/collateral';

export const CollateralizationStep: FC = () => {
  const [lineOfCredit, setLineOfCredit] = useState(200);
  const [selectedCollateralAsset, setSelectedCollateralAsset] = useState<CollateralAsset>();
  const [requiredCollateral, setRequiredCollateral] = useState(0);
  const [shouldCall, setShouldCall] = useState(false);

  const getAssetPriceResponse: QueryResponse<AssetPrice[]> = useGetAssetPrice();
  const getDepositAddressResponse: QueryResponse<GetDepositAddressResponse> = useGetDepositAddress(
    selectedCollateralAsset?.id ?? '',
    shouldCall,
  );

  useEffect(() => {
    if (selectedCollateralAsset !== undefined) {
      setShouldCall(true);
    } else {
      setShouldCall(false);
    }
  }, [selectedCollateralAsset]);

  useEffect(() => {
    if (getAssetPriceResponse.state === RequestState.SUCCESS) {
      if (selectedCollateralAsset) {
        const asset = getAssetPriceResponse.data.find((asset) => asset.asset === selectedCollateralAsset.id);

        if (asset) {
          const assetPrice = 1 / asset.price;
          const result = (lineOfCredit / (selectedCollateralAsset.loan_to_value / 100)) * assetPrice;

          setRequiredCollateral(Math.ceil(result * 10000) / 10000);
        }
      }
    }
  }, [getAssetPriceResponse]);

  const getDepositAddress = (): string | undefined => {
    if (getDepositAddressResponse.state === RequestState.SUCCESS) {
      return getDepositAddressResponse.data.address;
    }

    return undefined;
  };

  return (
    <Container column mobileColumn alignItems="center">
      <Collateral />
      <StepsIndicator currentStep={Step.COLLATERALIZE} />
      <EmailVerification />
      <CollateralizationStepStyled>
        <SubtitleS className="title">Send crypto to your collateral wallet</SubtitleS>
        <ParagraphXS className="subtitle">
          Choose your desired initial line of credit and which crypto asset you'd like to collateralize
        </ParagraphXS>

        <div className="inputs">
          <InputSelect setSelectedAsset={setSelectedCollateralAsset} />
          <InputRange label="Credit Amount" min={200} max={1500} value={lineOfCredit} onChange={setLineOfCredit} />
        </div>

        <div className="result">
          <div className="result-item">
            <ParagraphXS weight={700}>Required Collateral</ParagraphXS>
            <SubtitleS weight={400}>
              {Number(requiredCollateral.toFixed(4)) * 1} {selectedCollateralAsset?.short}
              <span className={`placeholder ${getDepositAddress() && 'fade-out'}`}>-/-</span>
            </SubtitleS>
          </div>
          <div className="result-item">
            <ParagraphXS weight={700}>Loan-to-Value</ParagraphXS>
            <SubtitleS weight={400}>
              {selectedCollateralAsset?.loan_to_value}%
              <span className={`placeholder ${getDepositAddress() && 'fade-out'}`}>-/-</span>
            </SubtitleS>
          </div>
          <div className="result-item">
            <ParagraphXS weight={700}>Interest Rate</ParagraphXS>
            <SubtitleS weight={400}>
              {selectedCollateralAsset?.interest_rate}%
              <span className={`placeholder ${getDepositAddress() && 'fade-out'}`}>-/-</span>
            </SubtitleS>
          </div>
        </div>

        <div className="address">
          <ParagraphXS weight={700}>
            Send {requiredCollateral.toFixed(4)} {selectedCollateralAsset?.short} to:
          </ParagraphXS>
          <div className="address-copy">
            <ParagraphS>{getDepositAddress()}</ParagraphS>
            <button className="btn-copy" onClick={() => navigator.clipboard.writeText(getDepositAddress() ?? '')}>
              <Copy className="icon-copy" />
            </button>
          </div>
          <div className="address-code">
            <div className="code">
              <QRCode value={getDepositAddress() ?? ''} size={96} />
            </div>
            <div className="info">
              <div className="info-group">
                <ParagraphXS>
                  Make sure you <b>only</b> send {selectedCollateralAsset?.short} to this address.
                </ParagraphXS>
              </div>
              <div className="info-group">
                <ParagraphXS>We will wait for 3 confirmations before your collateral is accepted.</ParagraphXS>
                <ParagraphXS className="info-link">
                  Follow along on
                  <a
                    href={`${selectedCollateralAsset?.url}/${getDepositAddress()}`}
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
                  You can only spend up to <b>{selectedCollateralAsset?.loan_to_value}%</b> of your line of credit.
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
          <div className={`overlay ${getDepositAddress() && 'fade-out'}`} />
        </div>
      </CollateralizationStepStyled>
    </Container>
  );
};
