import { FC } from 'react';
import { format, parseISO } from 'date-fns';
import { useTranslation, Trans } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { QueryResponse, RequestState } from '@archie-webapps/shared/data-access/archie-api/interface';
import { LTV } from '@archie-webapps/shared/data-access/archie-api/collateral/api/get-ltv';
import { useGetLTV } from '@archie-webapps/shared/data-access/archie-api/collateral/hooks/use-get-ltv';
import { useGetMarginCalls } from '@archie-webapps/shared/data-access/archie-api/collateral/hooks/use-get-margin-calls';
import { useGetCredit } from '@archie-webapps/shared/data-access/archie-api/credit/hooks/use-get-credit';
import { useGetCollateralTotalValue } from '@archie-webapps/shared/data-access/archie-api/collateral/hooks/use-get-collateral-total-value';
import { TARGET_LTV } from '@archie-webapps/archie-dashboard/constants';
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
  const getCollateralTotalValueResponse = useGetCollateralTotalValue();

  if (
    getLTVResponse.state === RequestState.SUCCESS &&
    getMarginCallsResponse.state === RequestState.SUCCESS &&
    getCreditQueryResponse.state === RequestState.SUCCESS &&
    getCollateralTotalValueResponse.state === RequestState.SUCCESS
  ) {
    const ltvData = getLTVResponse.data;
    const marginCallsData = getMarginCallsResponse.data[0];
    const creditData = getCreditQueryResponse.data;
    const collateralTotalValue = getCollateralTotalValueResponse.data.value;

    const getDate = () => format(parseISO(marginCallsData.automaticLiquidationAt), 'MMM dd, yyyy HH:mm');

    const getMinCollateral = () => {
      const ltv = TARGET_LTV / 100;

      return (creditData.utilizationAmount - ltv * collateralTotalValue) / (1 - ltv);
    };

    return (
      <div className="content">
        <BodyL weight={800} color={theme.textLight}>
          {t('margin_call_alert.title')}
        </BodyL>
        <BodyM color={theme.textLight}>
          <Trans
            components={{ b: <b /> }}
            values={{ ltv: ltvData.ltv.toFixed(2), minCollateral: getMinCollateral().toFixed(2), date: getDate() }}
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

  return <></>;
};
