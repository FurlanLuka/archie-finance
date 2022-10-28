import { FC } from 'react';

import {
  Ltv,
  LtvStatus,
} from '@archie/api/ltv-api/data-transfer-objects/types';
import { LTVColor } from '@archie/ui/shared/constants';
import { useGetLTV } from '@archie/ui/shared/data-access/archie-api/collateral/hooks/use-get-ltv';
import {
  QueryResponse,
  RequestState,
} from '@archie/ui/shared/data-access/archie-api/interface';

import { Danger } from './blocks/danger/danger';
import { Warning } from './blocks/warning/warning';
import { MarginCallAlertStyled } from './margin-call.styled';

interface MarginCallAlertProps {
  withButton?: boolean;
}

export const MarginCallAlert: FC<MarginCallAlertProps> = ({ withButton }) => {
  const getLTVResponse: QueryResponse<Ltv> = useGetLTV();

  const getContent = () => {
    if (getLTVResponse.state === RequestState.SUCCESS) {
      const ltvData = getLTVResponse.data;

      if (ltvData.status === LtvStatus.warning) {
        return (
          <MarginCallAlertStyled bgColor={LTVColor[ltvData.status]}>
            <Warning withButton={withButton} />
          </MarginCallAlertStyled>
        );
      }

      if (ltvData.status === LtvStatus.margin_call) {
        return (
          <MarginCallAlertStyled bgColor={LTVColor[ltvData.status]}>
            <Danger withButton={withButton} />
          </MarginCallAlertStyled>
        );
      }
    }

    return null;
  };

  return getContent();
};
