import { FC, useEffect, useState } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { Navigate, useNavigate } from 'react-router-dom';

import { OnboardingStep } from '@archie/ui/dashboard/constants';
import { useCreateRizeUser } from '@archie/ui/shared/data-access/archie-api/credit/hooks/use-create-rize-user';
import { useGetCredit } from '@archie/ui/shared/data-access/archie-api/credit/hooks/use-get-credit';
import {
  MutationState,
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

  const createUserMutation = useCreateRizeUser();
  const getCreditResponse = useGetCredit();
  const getLedgerResponse = useGetLedger();

  useEffect(() => {
    if (stage === Stage.CREATE_USER) {
      if (createUserMutation.state === MutationState.IDLE) {
        createUserMutation.mutate({});
      }

      if (createUserMutation.state === MutationState.SUCCESS) {
        setStage(Stage.COMPLETE);
      }
    }
  }, [stage, createUserMutation]);

  const getTitle = () => {
    switch (stage) {
      case Stage.CREATE_USER:
        return `${t('card_step.title.create')}`;
      case Stage.COMPLETE:
        return `${t('card_step.title.complete')}`;
    }
  };

  const getCreditValue = () => {
    if (
      getCreditResponse.state === RequestState.SUCCESS &&
      stage === Stage.COMPLETE
    ) {
      return getCreditResponse.data.totalCredit;
    }

    return 0;
  };

  const getContent = () => {
    if (
      getCreditResponse.state === RequestState.LOADING ||
      getLedgerResponse.state === RequestState.LOADING
    ) {
      return (
        <Card height="474px">
          <Skeleton />
        </Card>
      );
    }

    if (
      getCreditResponse.state === RequestState.ERROR ||
      getLedgerResponse.state === RequestState.ERROR
    ) {
      return (
        <Navigate to="/onboarding/error" state={{ prevPath: '/onboarding' }} />
      );
    }

    if (
      getCreditResponse.state === RequestState.SUCCESS &&
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
