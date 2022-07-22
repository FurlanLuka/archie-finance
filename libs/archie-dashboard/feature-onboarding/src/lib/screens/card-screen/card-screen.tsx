import { FC, useEffect, useState } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { TotalCollateralValue } from '@archie-webapps/shared/data-access-archie-api/collateral/api/get-collateral-total-value';
import { useGetCollateralTotalValue } from '@archie-webapps/shared/data-access-archie-api/collateral/hooks/use-get-collateral-total-value';
import { GetCreditResponse } from '@archie-webapps/shared/data-access-archie-api/credit/api/get-credit';
import { useCreateRizeUser } from '@archie-webapps/shared/data-access-archie-api/credit/hooks/use-create-rize-user';
import { useGetCredit } from '@archie-webapps/shared/data-access-archie-api/credit/hooks/use-get-credit';
import {
  MutationQueryResponse,
  QueryResponse,
  RequestState,
} from '@archie-webapps/shared/data-access-archie-api/interface';
import { ButtonPrimary, Container, ParagraphXS, SubtitleM } from '@archie-webapps/shared/ui-design-system';
import { Step } from '@archie-webapps/util-constants';

import imgCardReady from '../../../assets/img-card-ready.png';
import { EmailVerificationAlert } from '../../components/alerts/email-verification/email-verification';
import { StepsIndicator } from '../../components/steps-indicator/steps-indicator';

import { CardScreenStyled } from './card-screen.styled';

enum Stage {
  CREATE_USER,
  COMPLETE,
}

export const CardScreen: FC = () => {
  const { t } = useTranslation();

  const navigate = useNavigate();

  const [stage, setStage] = useState(Stage.CREATE_USER);

  const createUserQuery: MutationQueryResponse = useCreateRizeUser();
  const getCreditQueryResponse: QueryResponse<GetCreditResponse> = useGetCredit();
  const getCollateralTotalValueResponse: QueryResponse<TotalCollateralValue> = useGetCollateralTotalValue();

  useEffect(() => {
    if (stage === Stage.CREATE_USER) {
      if (createUserQuery.state === RequestState.IDLE) {
        createUserQuery.mutate({});
      }

      if (createUserQuery.state === RequestState.SUCCESS) {
        setStage(Stage.COMPLETE);
      }
    }
  }, [stage, createUserQuery]);

  const getTitle = () => {
    switch (stage) {
      case Stage.CREATE_USER:
        return `${t('card_step.title.create')}`;
      case Stage.COMPLETE:
        return `${t('card_step.title.complete')}`;
    }
  };

  const getCollateralTotalValue = () => {
    if (getCollateralTotalValueResponse.state === RequestState.SUCCESS && stage === Stage.COMPLETE) {
      return getCollateralTotalValueResponse.data.value;
    }

    return 0;
  };

  const getCreditValue = () => {
    if (getCreditQueryResponse.state === RequestState.SUCCESS && stage === Stage.COMPLETE) {
      return getCreditQueryResponse.data.totalCredit;
    }

    return 0;
  };

  return (
    <Container column mobileColumn alignItems="center">
      <StepsIndicator currentStep={Step.CARD} />
      <EmailVerificationAlert />
      <CardScreenStyled>
        <SubtitleM className="title">{getTitle()}</SubtitleM>
        <ParagraphXS className="subtitle">
          {stage === Stage.COMPLETE && (
            <Trans
              components={{ br: <br /> }}
              values={{ total_value: getCollateralTotalValue(), credit_value: getCreditValue() }}
            >
              card_step.subtitle
            </Trans>
          )}
        </ParagraphXS>
        <div className="image">
          <img src={imgCardReady} alt={t('card_step.img_alt')} />
        </div>
        <ButtonPrimary
          maxWidth="20rem"
          isLoading={getCollateralTotalValueResponse.state === RequestState.LOADING}
          isDisabled={!(getCreditQueryResponse.state === RequestState.SUCCESS && stage === Stage.COMPLETE)}
          onClick={() => navigate('/collateral')}
        >
          {t('card_step.btn')}
        </ButtonPrimary>
      </CardScreenStyled>
    </Container>
  );
};
