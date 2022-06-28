import { FC, useEffect, useState } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import QRCode from 'react-qr-code';
import ReactTooltip from 'react-tooltip';
import { QueryResponse, RequestState } from '@archie/api-consumer/interface';
import { useGetAssetPrice } from '@archie/api-consumer/asset_price/hooks/use-get-asset-price';
import { AssetPrice } from '@archie/api-consumer/asset_price/api/get-asset-price';
import { GetDepositAddressResponse } from '@archie/api-consumer/deposit_address/api/get-deposit-address';
import { useGetDepositAddress } from '@archie/api-consumer/deposit_address/hooks/use-get-deposit-address';
import { CollateralAsset } from '../../../../../constants/data/collateral-assets';
import { Step } from '../../../../../constants/onboarding-steps';
import { Container } from '../../../../../components/_generic/layout/layout.styled';
import { SubtitleM, ParagraphS, ParagraphXS } from '../../../../../components/_generic/typography/typography.styled';
import { Copy } from '../../../../../components/_generic/icons/copy';
import { StepsIndicator } from '../../steps-indicator/steps-indicator';
import { EmailVerification } from '../../email-verification/email-verification';
import { CollateralizationStepStyled } from './collateralization-step.styled';
import { InputRange } from '../../../../../components/_generic/input-range/input-range';
import { InputSelect } from '../../../../../components/_generic/input-select/input-select';
import { ExternalLink } from '../../../../../components/_generic/icons/external-link';
import { Collateral } from '../../../../../components/collateral/collateral';
import { theme } from '@archie-webapps/ui-theme';

export const CollateralizationStep: FC = () => {
  const { t } = useTranslation();

  const [lineOfCredit, setLineOfCredit] = useState(200);
  const [selectedCollateralAsset, setSelectedCollateralAsset] = useState<CollateralAsset>();
  const [requiredCollateral, setRequiredCollateral] = useState(0);
  const [shouldCall, setShouldCall] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

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

  const getFormattedCollateral = () => {
    const value =
      selectedCollateralAsset?.short === 'USDC'
        ? Number(requiredCollateral.toFixed(2)) * 1
        : Number(requiredCollateral.toFixed(4)) * 1;

    return `${value} ${selectedCollateralAsset?.short}`;
  };

  const handleCopyToClipboard = (id: string, value?: string) =>
    navigator.clipboard.writeText(value ?? '').then(() => {
      document.getElementById(id)?.classList.add('copied');

      setTimeout(() => {
        document.getElementById(id)?.classList.remove('copied');
      }, 1000);
    });

  return (
    <Container column mobileColumn alignItems="center">
      <Collateral />
      <StepsIndicator currentStep={Step.COLLATERALIZE} />
      <EmailVerification />
      <CollateralizationStepStyled>
        <SubtitleM className="title">{t('collateralization_step.title')}</SubtitleM>
        <ParagraphXS className="subtitle">{t('collateralization_step.subtitle')}</ParagraphXS>

        <div className="inputs">
          <InputSelect setSelectedAsset={setSelectedCollateralAsset} />
          <InputRange
            label={t('collateralization_step.inputs.input_range_label')}
            min={200}
            max={1500}
            value={lineOfCredit}
            onChange={setLineOfCredit}
          />
        </div>

        <div className="result">
          <div className="result-item">
            <ParagraphXS weight={700}>{t('collateralization_step.result.first')}</ParagraphXS>
            <SubtitleM weight={400} id="collateral">
              <span
                className="clickable"
                data-tip="Click to copy"
                onClick={() => handleCopyToClipboard('collateral', requiredCollateral as unknown as string)}
              >
                {getFormattedCollateral()}
              </span>
              <span className={`placeholder ${getDepositAddress() && 'fade-out'}`}>-/-</span>
            </SubtitleM>
            <ReactTooltip
              textColor={theme.tooltipText}
              backgroundColor={theme.tooltipBackground}
              effect="solid"
              delayHide={1000}
            />
          </div>
          <div className="result-item">
            <ParagraphXS weight={700}>{t('collateralization_step.result.second')}</ParagraphXS>
            <SubtitleM weight={400}>
              {selectedCollateralAsset?.loan_to_value}%
              <span className={`placeholder ${getDepositAddress() && 'fade-out'}`}>-/-</span>
            </SubtitleM>
          </div>
          <div className="result-item">
            <ParagraphXS weight={700}>{t('collateralization_step.result.third')}</ParagraphXS>
            <SubtitleM weight={400}>
              {selectedCollateralAsset?.interest_rate}%
              <span className={`placeholder ${getDepositAddress() && 'fade-out'}`}>-/-</span>
            </SubtitleM>
          </div>
        </div>

        <div className="address">
          <ParagraphXS weight={700}>
            <Trans
              values={{
                required_collateral: getFormattedCollateral(),
              }}
            >
              collateralization_step.address.title
            </Trans>
          </ParagraphXS>
          <div className="address-copy">
            <ParagraphS id="address">
              <span
                className="clickable"
                data-tip="Click to copy"
                onClick={() => handleCopyToClipboard('address', getDepositAddress())}
              >
                {getDepositAddress()}
              </span>
            </ParagraphS>
            <ReactTooltip
              textColor={theme.tooltipText}
              backgroundColor={theme.tooltipBackground}
              effect="solid"
              delayHide={1000}
            />
            <button className="btn-copy" onClick={() => handleCopyToClipboard('address', getDepositAddress())}>
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
                  <Trans
                    components={{ b: <b /> }}
                    values={{ selected_collateral_asset: selectedCollateralAsset?.short }}
                  >
                    collateralization_step.address.info_text_1
                  </Trans>
                </ParagraphXS>
              </div>
              <div className="info-group">
                <ParagraphXS>
                  <Trans
                    components={{ b: <b /> }}
                    values={{ selected_collateral_asset: selectedCollateralAsset?.short }}
                  >
                    collateralization_step.address.info_text_2
                  </Trans>
                </ParagraphXS>
                <ParagraphXS className="info-link">
                  {t('collateralization_step.address.info_link_1')}
                  <a
                    href={`${selectedCollateralAsset?.url}/${getDepositAddress()}`}
                    target="_blank"
                    rel="noreferrer"
                    className="info-link-url"
                  >
                    {t('collateralization_step.address.info_link_2')}
                    <ExternalLink className="info-link-icon" />
                  </a>
                </ParagraphXS>
              </div>
            </div>
          </div>

          <hr className="divider" />

          <div className="terms">
            <div className="terms-title">
              <ParagraphXS weight={700}>{t('collateralization_step.terms.title')}</ParagraphXS>
            </div>
            <ul className="terms-list">
              <li className="terms-list-item">
                <ParagraphXS>
                  <Trans
                    components={{ b: <b /> }}
                    values={{ selected_collateral_asset: selectedCollateralAsset?.loan_to_value }}
                  >
                    collateralization_step.terms.first
                  </Trans>
                </ParagraphXS>
              </li>
              <li className="terms-list-item">
                <ParagraphXS>{t('collateralization_step.terms.second')}</ParagraphXS>
              </li>
              <li className="terms-list-item">
                <ParagraphXS>
                  <Trans
                    components={{ br: <br /> }}
                    values={{ selected_collateral_asset: selectedCollateralAsset?.loan_to_value }}
                  >
                    collateralization_step.terms.third
                  </Trans>
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
