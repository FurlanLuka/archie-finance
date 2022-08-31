import { FC } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import QRCode from 'react-qr-code';
import ReactTooltip from 'react-tooltip';

import { copyToClipboard } from '@archie-webapps/archie-dashboard/utils';
import { CollateralAsset } from '@archie-webapps/shared/constants';
import { useGetDepositAddress } from '@archie-webapps/shared/data-access/archie-api/deposit_address/hooks/use-get-deposit-address';
import { RequestState } from '@archie-webapps/shared/data-access/archie-api/interface';
import { Skeleton, BodyL, BodyM } from '@archie-webapps/shared/ui/design-system';
import { Icon } from '@archie-webapps/shared/ui/icons';
import { QR_CODE } from '@archie-webapps/shared/ui/theme';
import { theme } from '@archie-webapps/shared/ui/theme';

import { DepositAddressStyled } from './deposit-address.styled';

interface DepositAddressProps {
  assetInfo: CollateralAsset;
  assetAmount: number;
}

export const DepositAddress: FC<DepositAddressProps> = ({ assetInfo, assetAmount }) => {
  const { t } = useTranslation();
  const getDepositAddressResponse = useGetDepositAddress(assetInfo.id, true);

  const getDepositAddress = (): string | undefined => {
    if (getDepositAddressResponse.state === RequestState.SUCCESS) {
      return getDepositAddressResponse.data.address;
    }

    return undefined;
  };

  return (
    <DepositAddressStyled>
      {getDepositAddressResponse.state === RequestState.SUCCESS ? (
        <>
          <BodyM weight={700}>
            {t('collateralization_step.address.title', { required_collateral: `${assetAmount} ${assetInfo.short}` })}
          </BodyM>
          <div className="address-copy">
            <BodyL id="address">
              <span data-tip="Click to copy" onClick={() => copyToClipboard('address', getDepositAddress())}>
                {getDepositAddress()}
              </span>
            </BodyL>
            <ReactTooltip
              textColor={theme.tooltipText}
              backgroundColor={theme.tooltipBackground}
              effect="solid"
              delayHide={1000}
            />
            <button className="btn-copy" onClick={() => copyToClipboard('address', getDepositAddress())}>
              <Icon name="copy" />
            </button>
          </div>
          <div className="address-code">
            <QRCode value={getDepositAddress() ?? ''} size={QR_CODE} />
            <div className="info">
              <div className="info-group">
                <BodyM>
                  <Trans components={{ b: <b /> }} values={{ selected_collateral_asset: assetInfo.short }}>
                    collateralization_step.address.info_text_1
                  </Trans>
                </BodyM>
              </div>
              <div className="info-group">
                <BodyM>
                  <Trans components={{ b: <b /> }} values={{ selected_collateral_asset: assetInfo.short }}>
                    collateralization_step.address.info_text_2
                  </Trans>
                </BodyM>
                <BodyM className="info-link">
                  {t('collateralization_step.address.info_link_1')}
                  <a
                    href={`${assetInfo.url}/${getDepositAddress()}`}
                    target="_blank"
                    rel="noreferrer"
                    className="info-link-url"
                  >
                    {t('collateralization_step.address.info_link_2')}
                    <Icon name="external-link" fill={theme.textHighlight} className="info-link-icon" />
                  </a>
                </BodyM>
              </div>
            </div>
          </div>

          <hr className="divider" />

          <div className="terms">
            <div className="terms-title">
              <BodyM weight={700}>{t('collateralization_step.terms.title')}</BodyM>
            </div>
            <ul className="terms-list">
              <li className="terms-list-item">
                <BodyM>
                  <Trans components={{ b: <b /> }} values={{ selected_collateral_asset: assetInfo.loan_to_value }}>
                    collateralization_step.terms.first
                  </Trans>
                </BodyM>
              </li>
              <li className="terms-list-item">
                <BodyM>{t('collateralization_step.terms.second')}</BodyM>
              </li>
              <li className="terms-list-item">
                <BodyM>
                  <Trans components={{ br: <br /> }} values={{ selected_collateral_asset: assetInfo.loan_to_value }}>
                    collateralization_step.terms.third
                  </Trans>
                </BodyM>
              </li>
            </ul>
          </div>
        </>
      ) : (
        <Skeleton bgColor={theme.backgroundSecondary} />
      )}
    </DepositAddressStyled>
  );
};
