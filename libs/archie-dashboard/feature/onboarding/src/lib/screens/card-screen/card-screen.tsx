import { FC, useEffect, useState } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { Navigate, useNavigate } from 'react-router-dom';

import { OnboardingStep } from '@archie-webapps/archie-dashboard/constants';
import { TotalCollateralValue } from '@archie-webapps/shared/data-access/archie-api/collateral/api/get-collateral-total-value';
import { useGetCollateralTotalValue } from '@archie-webapps/shared/data-access/archie-api/collateral/hooks/use-get-collateral-total-value';
import { GetCreditResponse } from '@archie-webapps/shared/data-access/archie-api/credit/api/get-credit';
import { useCreateRizeUser } from '@archie-webapps/shared/data-access/archie-api/credit/hooks/use-create-rize-user';
import { useGetCredit } from '@archie-webapps/shared/data-access/archie-api/credit/hooks/use-get-credit';
import {
  MutationQueryResponse,
  QueryResponse,
  RequestState,
} from '@archie-webapps/shared/data-access/archie-api/interface';
import { ButtonPrimary, Container, Card, Loader, TitleL, BodyM } from '@archie-webapps/shared/ui/design-system';

import imgCardReady from '../../../assets/img-card-ready.png';
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

  const getContent = () => {
    if (
      getCreditQueryResponse.state === RequestState.LOADING ||
      getCollateralTotalValueResponse.state === RequestState.LOADING
    ) {
      return <Loader marginAuto />;
    }

    if (
      getCreditQueryResponse.state === RequestState.ERROR ||
      getCollateralTotalValueResponse.state === RequestState.ERROR
    ) {
      return <Navigate to="/onboarding/error" state={{ prevPath: '/onboarding' }} />;
    }

    if (
      getCreditQueryResponse.state === RequestState.SUCCESS &&
      getCollateralTotalValueResponse.state === RequestState.SUCCESS
    ) {
      return (
        <>
          <TitleL className="title">{getTitle()}</TitleL>
          <BodyM className="subtitle">
            {stage === Stage.COMPLETE && (
              <Trans
                components={{ br: <br /> }}
                values={{ total_value: getCollateralTotalValue().toFixed(2), credit_value: getCreditValue() }}
              >
                card_step.subtitle
              </Trans>
            )}
          </BodyM>
          <div className="image">
            <img src={imgCardReady} alt={t('card_step.img_alt')} />
          </div>
          <ButtonPrimary maxWidth="250px" isDisabled={stage !== Stage.COMPLETE} onClick={() => navigate('/collateral')}>
            {t('card_step.btn')}
          </ButtonPrimary>
        </>
      );
    }

    return <></>;
  };

  return (
    <Container column mobileColumn alignItems="center">
      <StepsIndicator currentStep={OnboardingStep.CARD} />
      <CardScreenStyled>
        <Card
          column
          alignItems="center"
          padding="2.5rem 10% 3.5rem"
          mobilePadding="2.5rem 1.5rem 3.5rem"
          minHeight="506px"
        >
          {getContent()}
        </Card>
      </CardScreenStyled>
    </Container>
  );
};
