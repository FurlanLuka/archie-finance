import { BigNumber } from 'bignumber.js';
import { format, parseISO } from 'date-fns';
import { FC } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Ledger } from '@archie/api/ledger-api/data-transfer-objects/types';
import { MINIMUM_LTV } from '@archie/ui/dashboard/constants';
import { calculateCollateralValue } from '@archie/ui/dashboard/utils';
import { LTV } from '@archie/ui/shared/data-access/archie-api/collateral/api/get-ltv';
import { useGetLTV } from '@archie/ui/shared/data-access/archie-api/collateral/hooks/use-get-ltv';
import { useGetMarginCalls } from '@archie/ui/shared/data-access/archie-api/collateral/hooks/use-get-margin-calls';
import { useGetCredit } from '@archie/ui/shared/data-access/archie-api/credit/hooks/use-get-credit';
import {
  QueryResponse,
  RequestState,
} from '@archie/ui/shared/data-access/archie-api/interface';
import { useGetLedger } from '@archie/ui/shared/data-access/archie-api/ledger/hooks/use-get-ledger';
import { ButtonLight, BodyL, BodyM } from '@archie/ui/shared/design-system';
import { theme } from '@archie/ui/shared/theme';

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

    const getDate = () =>
      format(
        parseISO(marginCallsData.automaticLiquidationAt),
        'MMM dd, yyyy HH:mm',
      );
    const getCollateralMinValue = calculateCollateralValue(
      MINIMUM_LTV,
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
            <ButtonLight
              color={theme.textDanger}
              onClick={() => navigate('/collateral')}
            >
              {t('margin_call_alert.btn')}
            </ButtonLight>
          )}
        </div>
      );
    }
  }

  return <></>;
};
