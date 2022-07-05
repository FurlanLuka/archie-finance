import { FC, useEffect, useState } from 'react';
import { useTranslation, Trans } from 'react-i18next';

import { TotalCollateralValue } from '@archie-webapps/shared/data-access-archie-api/collateral/api/get-collateral-total-value';
import { useGetCollateralTotalValue } from '@archie-webapps/shared/data-access-archie-api/collateral/hooks/use-get-collateral-total-value';
import { GetCreditResponse } from '@archie-webapps/shared/data-access-archie-api/credit/api/get-credit';
import { useCreateRizeUser } from '@archie-webapps/shared/data-access-archie-api/credit/hooks/use-create-rize-user';
import { useGetCredit } from '@archie-webapps/shared/data-access-archie-api/credit/hooks/use-get-credit';
import { useIssueCard } from '@archie-webapps/shared/data-access-archie-api/credit/hooks/use-issue-card';
import {
  MutationQueryResponse,
  QueryResponse,
  RequestState,
} from '@archie-webapps/shared/data-access-archie-api/interface';
import { ButtonPrimary, Container, ParagraphXS, SubtitleM } from '@archie-webapps/ui-design-system';
import { Step } from '@archie-webapps/util-constants';

import imgCardReady from '../../../assets/img-card-ready.png';
import { EmailVerification } from '../../components/email-verification/email-verification';
import { StepsIndicator } from '../../components/steps-indicator/steps-indicator';

import { CardScreenStyled } from './card-screen.styled';

enum Stage {
  CREATE_USER,
  ISSUE_CARD,
  COMPLETE,
}

export const CardScreen: FC = () => {
  const { t } = useTranslation();

  const [stage, setStage] = useState(Stage.CREATE_USER);

  const createUserQuery: MutationQueryResponse = useCreateRizeUser();
  const issueCardQuery: MutationQueryResponse = useIssueCard();
  const getCreditQueryResponse: QueryResponse<GetCreditResponse> = useGetCredit();
  const getCollateralTotalValueResponse: QueryResponse<TotalCollateralValue> = useGetCollateralTotalValue();

  useEffect(() => {
    if (stage === Stage.CREATE_USER) {
      if (createUserQuery.state === RequestState.IDLE) {
        createUserQuery.mutate({});
      }

      if (createUserQuery.state === RequestState.SUCCESS) {
        setStage(Stage.ISSUE_CARD);
      }
    }
  }, [stage, createUserQuery]);

  useEffect(() => {
    if (stage === Stage.ISSUE_CARD) {
      if (issueCardQuery.state === RequestState.IDLE) {
        issueCardQuery.mutate({});
      }

      if (issueCardQuery.state === RequestState.SUCCESS) {
        setStage(Stage.COMPLETE);
      }
    }
  }, [stage, issueCardQuery]);

  const getTitle = () => {
    switch (stage) {
      case Stage.CREATE_USER:
        return `${t('card_step.title.create')}`;
      case Stage.ISSUE_CARD:
        return `${t('card_step.title.issue')}`;
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
      <EmailVerification />
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
          maxWidth="16rem"
          isLoading={getCollateralTotalValueResponse.state === RequestState.LOADING}
          // isDisabled={isEmailVerified} TBD
        >
          {t('card_step.btn')}
        </ButtonPrimary>
      </CardScreenStyled>
    </Container>
  );
};
