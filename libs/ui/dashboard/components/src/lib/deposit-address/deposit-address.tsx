import { FC } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import QRCode from 'react-qr-code';
import ReactTooltip from 'react-tooltip';

import { copyToClipboard } from '@archie/ui/dashboard/utils';
import { CollateralAsset } from '@archie/ui/shared/constants';
import { RequestState } from '@archie/ui/shared/data-access/archie-api/interface';
import { useGetDepositAddress } from '@archie/ui/shared/data-access/archie-api/vault_account/hooks/use-get-deposit-address';
import { Skeleton, BodyL, BodyM, Link } from '@archie/ui/shared/design-system';
import { Icon } from '@archie/ui/shared/icons';
import { QR_CODE } from '@archie/ui/shared/theme';
import { theme } from '@archie/ui/shared/theme';

import { DepositAddressStyled } from './deposit-address.styled';

interface DepositAddressProps {
  assetInfo: CollateralAsset;
  assetAmount?: number;
  showTerms?: boolean;
}

export const DepositAddress: FC<DepositAddressProps> = ({
  assetInfo,
  assetAmount,
  showTerms,
}) => {
  const { t } = useTranslation();
  const getDepositAddressResponse = useGetDepositAddress(assetInfo.id);

  const getDepositAddress = (): string | undefined => {
    if (getDepositAddressResponse.state === RequestState.SUCCESS) {
      return getDepositAddressResponse.data.address;
    }

    return undefined;
  };

  return (
    <DepositAddressStyled showTerms={showTerms}>
      {getDepositAddressResponse.state === RequestState.SUCCESS ? (
        <>
          <BodyM weight={700}>
            {t('collateralization_step.address.title', {
              required_collateral: `${assetAmount ?? ''} ${assetInfo.short}`,
            })}
          </BodyM>
          <div className="address-copy">
            <BodyL id="address">
              <span
                data-tip="Click to copy"
                onClick={() => copyToClipboard('address', getDepositAddress())}
              >
                {getDepositAddress()}
              </span>
            </BodyL>
            <ReactTooltip
              textColor={theme.tooltipText}
              backgroundColor={theme.tooltipBackground}
              effect="solid"
              delayHide={1000}
            />
            <button
              className="btn-copy"
              onClick={() => copyToClipboard('address', getDepositAddress())}
            >
              <Icon name="copy" />
            </button>
          </div>
          <div className="address-code">
            <QRCode value={getDepositAddress() ?? ''} size={QR_CODE} />
            <div className="info">
              <div className="info-group">
                <BodyM>
                  <Trans
                    components={{ b: <b /> }}
                    values={{ selected_collateral_asset: assetInfo.short }}
                  >
                    collateralization_step.address.info_text_1
                  </Trans>
                </BodyM>
              </div>
              <div className="info-group">
                <BodyM>
                  <Trans
                    components={{ b: <b /> }}
                    values={{ selected_collateral_asset: assetInfo.short }}
                  >
                    collateralization_step.address.info_text_2
                  </Trans>
                </BodyM>
                <BodyM>
                  {t('collateralization_step.address.info_link_1')}
                  <Link
                    href={`${assetInfo.url}/${getDepositAddress()}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {t('collateralization_step.address.info_link_2')}
                    <Icon name="external-link" fill={theme.textHighlight} />
                  </Link>
                </BodyM>
              </div>
            </div>
          </div>

          {showTerms && (
            <>
              <hr className="divider" />
              <div className="terms">
                <div className="terms-title">
                  <BodyM weight={700}>
                    {t('collateralization_step.terms.title')}
                  </BodyM>
                </div>
                <ul className="terms-list">
                  <li className="terms-list-item">
                    <BodyM>
                      <Trans
                        components={{ b: <b /> }}
                        values={{
                          loan_to_value: assetInfo.loan_to_value,
                          asset: assetInfo.short,
                        }}
                      >
                        collateralization_step.terms.first
                      </Trans>
                    </BodyM>
                  </li>
                  <li className="terms-list-item">
                    <BodyM>{t('collateralization_step.terms.second')}</BodyM>
                  </li>
                  <li className="terms-list-item">
                    <BodyM>
                      <Trans components={{ br: <br /> }}>
                        collateralization_step.terms.third
                      </Trans>
                    </BodyM>
                  </li>
                </ul>
              </div>
            </>
          )}
        </>
      ) : (
        <Skeleton bgColor={theme.backgroundSecondary} />
      )}
    </DepositAddressStyled>
  );
};
