import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

import { useGetMaxWithdrawalAmount } from '@archie-webapps/shared/data-access-archie-api/collateral/hooks/use-get-max-withdrawal-amount';
import { RequestState } from '@archie-webapps/shared/data-access-archie-api/interface';
import { Card, ParagraphM, ParagraphS } from '@archie-webapps/ui-design-system';

import { WithdrawalForm } from '../withdrawal-form/withdrawal-form';

import * as Styled from './withdrawal_handler.styled';

const creditLine = '$4,564.34';
// TODO errors when asset is bogus
export const WithdrawalHandler: FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const currentAsset = location.pathname.slice(location.pathname.lastIndexOf('/') + 1);

  const getMaxWithdrawalAmountResponse = useGetMaxWithdrawalAmount(currentAsset);

  function getContent() {
    switch (getMaxWithdrawalAmountResponse.state) {
      case RequestState.ERROR:
        return <div>Something went wrong :( </div>;
      case RequestState.LOADING:
        return <div>Spooky scary skellingtons</div>;
      case RequestState.SUCCESS:
        return <WithdrawalForm currentAsset={currentAsset} maxAmount={getMaxWithdrawalAmountResponse.data.maxAmount} />;
      default:
        console.error('Withdrawalhandler unhandles request state');
        return null;
    }
  }

  return (
    <Styled.WithdrawContainer>
      <Card column alignItems="center" padding="2.5rem 1.5rem 3.5rem">
        <ParagraphM weight={800} className="title">
          {t('dashboard_withdraw.title', { currentAsset })}
        </ParagraphM>
        <ParagraphS className="subtitle">{t('dashboard_withdraw.subtitle', { creditLine })}</ParagraphS>
        {getContent()}
      </Card>
    </Styled.WithdrawContainer>
  );
};
