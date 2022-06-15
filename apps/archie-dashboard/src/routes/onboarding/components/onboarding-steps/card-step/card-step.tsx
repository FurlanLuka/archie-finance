import { FC, useEffect, useState } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { MutationQueryResponse, QueryResponse, RequestState } from '@archie/api-consumer/interface';
import { useCreateAptoUser } from '@archie/api-consumer/credit/hooks/use-create-apto-user';
import { useIssueCard } from '@archie/api-consumer/credit/hooks/use-issue-card';
import { useGetCredit } from '@archie/api-consumer/credit/hooks/use-get-credit';
import { GetCreditResponse } from '@archie/api-consumer/credit/api/get-credit';
import { useGetCollateralTotalValue } from '@archie/api-consumer/collateral/hooks/use-get-collateral-total-value';
import { TotalCollateralValue } from '@archie/api-consumer/collateral/api/get-collateral-total-value';
import { Step } from '../../../../../constants/onboarding-steps';
import { Container } from '../../../../../components/_generic/layout/layout.styled';
import { SubtitleM, ParagraphXS } from '../../../../../components/_generic/typography/typography.styled';
import { StepsIndicator } from '../../steps-indicator/steps-indicator';
import { EmailVerification } from '../../email-verification/email-verification';
import imgCardReady from '../../../../../assets/images/img-card-ready.png';
import { CardStepStyled } from './card-step.styled';
import { ButtonPrimary } from '../../../../../components/_generic/button/button.styled';

enum Stage {
  CREATE_USER,
  ISSUE_CARD,
  COMPLETE,
}

export const CardStep: FC = () => {
  const { t } = useTranslation();

  const [stage, setStage] = useState(Stage.CREATE_USER);

  const createUserQuery: MutationQueryResponse = useCreateAptoUser();
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
      <CardStepStyled>
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
      </CardStepStyled>
    </Container>
  );
};
