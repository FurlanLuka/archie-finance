import { BigNumber } from 'bignumber.js';
import { format, parseISO } from 'date-fns';
import { FC } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { calculateCollateralMinValue } from '@archie-webapps/archie-dashboard/utils';
import { LTV } from '@archie-webapps/shared/data-access/archie-api/collateral/api/get-ltv';
import { useGetLTV } from '@archie-webapps/shared/data-access/archie-api/collateral/hooks/use-get-ltv';
import { useGetMarginCalls } from '@archie-webapps/shared/data-access/archie-api/collateral/hooks/use-get-margin-calls';
import { useGetCredit } from '@archie-webapps/shared/data-access/archie-api/credit/hooks/use-get-credit';
import { QueryResponse, RequestState } from '@archie-webapps/shared/data-access/archie-api/interface';
import { Ledger } from '@archie-webapps/shared/data-access/archie-api/ledger/api/get-ledger';
import { useGetLedger } from '@archie-webapps/shared/data-access/archie-api/ledger/hooks/use-get-ledger';
import { ButtonLight, BodyL, BodyM } from '@archie-webapps/shared/ui/design-system';
import { theme } from '@archie-webapps/shared/ui/theme';

interface DangerProps {
  withButton?: boolean;
}

export const Danger: FC<DangerProps> = ({ withButton }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const getLTVResponse: QueryResponse<LTV> = useGetLTV();
  const getMarginCallsResponse = useGetMarginCalls();
  const getCreditQueryResponse = useGetCredit();
  const getLedgerResponse: QueryResponse<Ledger> = useGetLedger();

  // TODO: Think of optimizing these
  if (
    getLTVResponse.state === RequestState.SUCCESS &&
    getMarginCallsResponse.state === RequestState.SUCCESS &&
    getCreditQueryResponse.state === RequestState.SUCCESS &&
    getLedgerResponse.state === RequestState.SUCCESS
  ) {
    const ltvData = getLTVResponse.data;
    const marginCallsData = getMarginCallsResponse.data[0];
    const creditData = getCreditQueryResponse.data;
    const collateralTotalValue = getLedgerResponse.data.value;

    const getDate = () => format(parseISO(marginCallsData.automaticLiquidationAt), 'MMM dd, yyyy HH:mm');
    const getCollateralMinValue = calculateCollateralMinValue(
      creditData.utilizationAmount,
      BigNumber(collateralTotalValue).toNumber(),
    );

    if (marginCallsData) {
      return (
        <div className="content">
          <BodyL weight={800} color={theme.textLight}>
            {t('margin_call_alert.title')}
          </BodyL>
          <BodyM color={theme.textLight}>
            <Trans
              components={{ b: <b /> }}
              values={{
                ltv: ltvData.ltv.toFixed(2),
                minCollateral: getCollateralMinValue.toFixed(2),
                date: getDate(),
              }}
            >
              margin_call_alert.text_1
            </Trans>
          </BodyM>
          <BodyM color={theme.textLight}>{t('margin_call_alert.text_2')}</BodyM>
          {withButton && (
            <ButtonLight color={theme.textDanger} onClick={() => navigate('/collateral')}>
              {t('margin_call_alert.btn')}
            </ButtonLight>
          )}
        </div>
      );
    }
  }

  return <></>;
};
