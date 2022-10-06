import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, Navigate } from 'react-router-dom';

import { QueryResponse, RequestState } from '@archie-webapps/shared/data-access/archie-api/interface';
import { Ledger } from '@archie-webapps/shared/data-access/archie-api/ledger/api/get-ledger';
import { useGetLedger } from '@archie-webapps/shared/data-access/archie-api/ledger/hooks/use-get-ledger';
import { ButtonOutline, Card, Skeleton, TitleM, BodyM } from '@archie-webapps/shared/ui/design-system';

export const CollateralValue: FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const getLedgerResponse: QueryResponse<Ledger> = useGetLedger();

  if (getLedgerResponse.state === RequestState.LOADING) {
    return (
      <Card>
        <Skeleton />
      </Card>
    );
  }

  if (getLedgerResponse.state === RequestState.ERROR) {
    return <Navigate to="/error" state={{ prevPath: '/home' }} />;
  }

  if (getLedgerResponse.state === RequestState.SUCCESS) {
    return (
      <Card column alignItems="flex-start" justifyContent="space-between" padding="1.5rem">
        <div>
          <BodyM weight={700} className="card-title">
            {t('collateral_value_card.title')}
          </BodyM>
          <div className="text-group card-info">
            <TitleM weight={400}>${getLedgerResponse.data.value}</TitleM>
            {/* <BodyM weight={500} color={theme.textSuccess}>
            ↑
          </BodyM> */}
          </div>
        </div>
        {/* <CollateralValueChart /> */}
        <div className="btn-group">
          <ButtonOutline small onClick={() => navigate('/collateral')}>
            {t('btn_add')}
          </ButtonOutline>
          <ButtonOutline small isDisabled>
            {t('btn_redeem')}
          </ButtonOutline>
        </div>
      </Card>
    );
  }

  return <></>;
};
