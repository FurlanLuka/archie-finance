import { FC, useEffect, useState } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { Navigate, useNavigate } from 'react-router-dom';

import { Ledger } from '@archie/api/ledger-api/data-transfer-objects/types';
import { OnboardingStep } from '@archie/ui/dashboard/constants';
import { useCreateRizeUser } from '@archie/ui/shared/data-access/archie-api/credit/hooks/use-create-rize-user';
import { useGetCredit } from '@archie/ui/shared/data-access/archie-api/credit/hooks/use-get-credit';
import {
  MutationQueryResponse,
  QueryResponse,
  RequestState,
} from '@archie/ui/shared/data-access/archie-api/interface';
import { useGetLedger } from '@archie/ui/shared/data-access/archie-api/ledger/hooks/use-get-ledger';
import {
  ButtonPrimary,
  Container,
  Card,
  Skeleton,
  TitleL,
  BodyM,
} from '@archie/ui/shared/design-system';

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
  const getCreditQueryResponse = useGetCredit();
  const getLedgerResponse: QueryResponse<Ledger> = useGetLedger();

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
    if (
      getLedgerResponse.state === RequestState.SUCCESS &&
      stage === Stage.COMPLETE
    ) {
      return getLedgerResponse.data.value;
    }

    return 0;
  };

  const getCreditValue = () => {
    if (
      getCreditQueryResponse.state === RequestState.SUCCESS &&
      stage === Stage.COMPLETE
    ) {
      return getCreditQueryResponse.data.totalCredit;
    }

    return 0;
  };

  const getContent = () => {
    if (
      getCreditQueryResponse.state === RequestState.LOADING ||
      getLedgerResponse.state === RequestState.LOADING
    ) {
      return (
        <Card height="474px">
          <Skeleton />
        </Card>
      );
    }

    if (
      getCreditQueryResponse.state === RequestState.ERROR ||
      getLedgerResponse.state === RequestState.ERROR
    ) {
      return (
        <Navigate to="/onboarding/error" state={{ prevPath: '/onboarding' }} />
      );
    }

    if (
      getCreditQueryResponse.state === RequestState.SUCCESS &&
      getLedgerResponse.state === RequestState.SUCCESS
    ) {
      return (
        <Card
          column
          alignItems="center"
          padding="1.5rem 10% 2.5rem"
          mobilePadding="1.5rem 1.5rem 2.5rem"
        >
          <TitleL className="title">{getTitle()}</TitleL>
          <BodyM className="subtitle">
            {stage === Stage.COMPLETE && (
              <Trans
                components={{ br: <br /> }}
                values={{
                  total_value: getLedgerResponse.data.value,
                  credit_value: getCreditValue(),
                }}
              >
                card_step.subtitle
              </Trans>
            )}
          </BodyM>
          <div className="image">
            <img src={imgCardReady} alt={t('card_step.img_alt')} />
          </div>
          <ButtonPrimary
            width="250px"
            isDisabled={stage !== Stage.COMPLETE}
            onClick={() => navigate('/collateral')}
          >
            {t('card_step.btn')}
          </ButtonPrimary>
        </Card>
      );
    }

    return <></>;
  };

  return (
    <Container column mobileColumn alignItems="center">
      <StepsIndicator currentStep={OnboardingStep.CARD} />
      <CardScreenStyled>{getContent()}</CardScreenStyled>
    </Container>
  );
};
