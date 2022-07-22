import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { useCreateCreditLine } from '@archie-webapps/shared/data-access-archie-api/credit/hooks/use-create-credit-line';
import { RequestState } from '@archie-webapps/shared/data-access-archie-api/interface';
import { ButtonPrimary, ParagraphXS } from '@archie-webapps/shared/ui-design-system';

import { FloatingCreditLineStyled } from './create_credit_line.styled';

interface CreateCreditLineProps {
  collateralText: string;
  creditValue: number;
}

export const CreateCreditLine: FC<CreateCreditLineProps> = ({ collateralText, creditValue }) => {
  const createCreditLine = useCreateCreditLine();
  const { t } = useTranslation();

  return (
    <FloatingCreditLineStyled>
      <ParagraphXS weight={700} className="credit-info">
        {t('collateral_credit_line_popup.text', {
          collateral: collateralText,
          credit_value: creditValue,
        })}
      </ParagraphXS>
      <ButtonPrimary
        onClick={() => {
          if (createCreditLine.state === RequestState.IDLE) {
            createCreditLine.mutate({});
          }
        }}
      >
        {t('collateral_credit_line_popup.button_text')}
      </ButtonPrimary>
    </FloatingCreditLineStyled>
  );
};
