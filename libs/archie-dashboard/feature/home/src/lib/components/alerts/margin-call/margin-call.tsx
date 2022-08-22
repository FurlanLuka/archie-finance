import { FC } from 'react';

import { LTVStatus, LTVColor } from '@archie-webapps/shared/constants';
import { LTV } from '@archie-webapps/shared/data-access/archie-api/collateral/api/get-ltv';
import { useGetLTV } from '@archie-webapps/shared/data-access/archie-api/collateral/hooks/use-get-ltv';
import { QueryResponse, RequestState } from '@archie-webapps/shared/data-access/archie-api/interface';

import { Danger } from './blocks/danger/danger';
import { Warning } from './blocks/warning/warning';
import { MarginCallAlertStyled } from './margin-call.styled';

export const MarginCallAlert: FC = () => {
  const getLTVResponse: QueryResponse<LTV> = useGetLTV();

  const getContent = () => {
    if (getLTVResponse.state === RequestState.SUCCESS) {
      const ltvData = getLTVResponse.data;

      if (ltvData.status === LTVStatus.WARNING) {
        return (
          <MarginCallAlertStyled bgColor={LTVColor[ltvData.status]}>
            <Warning />
          </MarginCallAlertStyled>
        );
      }

      if (ltvData.status === LTVStatus.MARGIN_CALL) {
        return (
          <MarginCallAlertStyled bgColor={LTVColor[ltvData.status]}>
            <Danger />
          </MarginCallAlertStyled>
        );
      }
    }

    return null;
  };

  return getContent();
};
