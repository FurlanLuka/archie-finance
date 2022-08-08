import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { getFormattedValue } from '@archie-webapps/archie-dashboard/utils';
import { TotalCollateralValue } from '@archie-webapps/shared/data-access/archie-api/collateral/api/get-collateral-total-value';
import { useGetCollateralTotalValue } from '@archie-webapps/shared/data-access/archie-api/collateral/hooks/use-get-collateral-total-value';
import { QueryResponse, RequestState } from '@archie-webapps/shared/data-access/archie-api/interface';
import { ButtonOutline, Card, Skeleton, ParagraphXS, SubtitleS } from '@archie-webapps/shared/ui/design-system';
import { theme } from '@archie-webapps/shared/ui/theme';

import { CollateralValueChart } from '../charts/collateral-value/collateral-value';

export const CollateralValue: FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const getCollateralTotalValueResponse: QueryResponse<TotalCollateralValue> = useGetCollateralTotalValue();

  if (getCollateralTotalValueResponse.state === RequestState.LOADING) {
    return (
      <Card>
        <Skeleton />
      </Card>
    );
  }

  if (getCollateralTotalValueResponse.state === RequestState.ERROR) {
    return <div>Something went wrong :(</div>; // TODO: replace with error state
  }

  if (getCollateralTotalValueResponse.state === RequestState.SUCCESS) {
    const collateralTotalValue = getCollateralTotalValueResponse.data.value;

    return (
      <Card column alignItems="flex-start" justifyContent="space-between" padding="1.5rem">
        <div>
          <ParagraphXS weight={700} className="card-title">
            Collateral Value
          </ParagraphXS>
          <div className="text-group card-info">
            <SubtitleS weight={400}>${getFormattedValue(collateralTotalValue)}</SubtitleS>
            {/* <ParagraphXS weight={500} color={theme.textSuccess}>
            ↑
          </ParagraphXS> */}
          </div>
        </div>
        {/* <CollateralValueChart /> */}
        <div className="btn-group">
          <ButtonOutline maxWidth="auto" small onClick={() => navigate('/collateral')}>
            Add
          </ButtonOutline>
          <ButtonOutline maxWidth="auto" small isDisabled>
            Redeem
          </ButtonOutline>
        </div>
      </Card>
    );
  }

  return <></>;
};
