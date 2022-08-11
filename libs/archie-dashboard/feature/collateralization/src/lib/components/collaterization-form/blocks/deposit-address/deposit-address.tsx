import { FC } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import ReactTooltip from 'react-tooltip';
import QRCode from 'react-qr-code';

import { CollateralAsset } from '@archie-webapps/shared/constants';
import { QR_CODE } from '@archie-webapps/shared/ui/theme';
import { copyToClipboard } from '@archie-webapps/archie-dashboard/utils';
import { useGetDepositAddress } from '@archie-webapps/shared/data-access/archie-api/deposit_address/hooks/use-get-deposit-address';
import { RequestState } from '@archie-webapps/shared/data-access/archie-api/interface';
import { Skeleton, ParagraphS, ParagraphXS } from '@archie-webapps/shared/ui/design-system';
import { theme } from '@archie-webapps/shared/ui/theme';
import { Icon } from '@archie-webapps/shared/ui/icons';

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
      <ParagraphXS weight={700}>
        {t('collateralization_step.address.title', { required_collateral: assetAmount })}
      </ParagraphXS>
      <div className="address-copy">
        <ParagraphS id="address">
          <span data-tip="Click to copy" onClick={() => copyToClipboard('address', getDepositAddress())}>
            {getDepositAddress()}
          </span>
        </ParagraphS>
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
            <ParagraphXS>
              <Trans components={{ b: <b /> }} values={{ selected_collateral_asset: assetInfo.short }}>
                collateralization_step.address.info_text_1
              </Trans>
            </ParagraphXS>
          </div>
          <div className="info-group">
            <ParagraphXS>
              <Trans components={{ b: <b /> }} values={{ selected_collateral_asset: assetInfo.short }}>
                collateralization_step.address.info_text_2
              </Trans>
            </ParagraphXS>
            <ParagraphXS className="info-link">
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
              <Trans components={{ b: <b /> }} values={{ selected_collateral_asset: assetInfo.loan_to_value }}>
                collateralization_step.terms.first
              </Trans>
            </ParagraphXS>
          </li>
          <li className="terms-list-item">
            <ParagraphXS>{t('collateralization_step.terms.second')}</ParagraphXS>
          </li>
          <li className="terms-list-item">
            <ParagraphXS>
              <Trans components={{ br: <br /> }} values={{ selected_collateral_asset: assetInfo.loan_to_value }}>
                collateralization_step.terms.third
              </Trans>
            </ParagraphXS>
          </li>
        </ul>
      </div>
      {!(getDepositAddressResponse.state === RequestState.SUCCESS) && <Skeleton bgColor={theme.backgroundSecondary} />}
    </DepositAddressStyled>
  );
};
